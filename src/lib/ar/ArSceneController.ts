import * as THREE from 'three';
import type { Direction } from '../../data/landmarks';
import { averageHeadingDeg } from '../deviceOrientation';
import { aimSoldierTowardCamera, createRomanSoldier } from '../romanSoldierModel';
import { OrientationStabilizer, quaternionFromDeviceSample, type OrientationSample } from './ArOrientation';
import {
  GUARD_HEIGHT_M,
  horizontalTurnDeg,
  visibilityFromTurnDeg,
  worldBearingForDirection,
  worldPositionFromBearing,
} from './ArWorldAnchor';
import { loadGuardScale, clampGuardScale } from '../guardScaleStorage';
import { buildBubbleAnchor, projectWorldToScreen } from './projectToScreen';

const SOLDIER_BASE_SCALE = 1.15;
const CAMERA_SLERP = 0.14;
const FACE_SLERP = 0.15;
const LOCK_SAMPLES_NEEDED = 4;

export interface ArGuidanceState {
  relativeBearingDeg: number;
  viewAngle: number;
  guardVisible: boolean;
  worldBearing: number;
  hasCompass: boolean;
  guardScale: number;
  anchorLocked: boolean;
}

export interface ArSceneState extends ArGuidanceState {
  bubbleAnchor: ReturnType<typeof buildBubbleAnchor>;
}

export class ArSceneController {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(50, 1, 0.2, 120);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly soldier = createRomanSoldier();
  private readonly guardPos = new THREE.Vector3();
  private readonly cameraPos = new THREE.Vector3(0, 1.62, 0);
  private readonly stabilizer = new OrientationStabilizer();
  private readonly targetQuat = new THREE.Quaternion();
  private readonly smoothQuat = new THREE.Quaternion();
  private readonly aimForward = new THREE.Vector3();
  private readonly headWorld = new THREE.Vector3();
  private lastSample: OrientationSample | null = null;

  private worldBearing = 0;
  private yawDragRad = 0;
  private direction: Direction = 'ravno';
  private locked = false;
  private lockHeadings: number[] = [];
  private displayOpacity = 0;
  private lastMaterialOpacity = -1;
  private idlePhase = 0;
  private smoothScreenX = 0;
  private smoothScreenY = 0;
  private screenInitialized = false;
  private guardUserScale = loadGuardScale();
  private smoothFaceYaw = 0;
  private faceYawInitialized = false;

  constructor(canvas: HTMLCanvasElement) {
    this.camera.position.copy(this.cameraPos);
    this.smoothQuat.identity();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.add(new THREE.AmbientLight(0xfff8f0, 0.75));
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.35);
    sun.position.set(3, 8, 5);
    this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0xc8d8ff, 0.45);
    rim.position.set(-4, 2, -3);
    this.scene.add(rim);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.62, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd4a843,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.02;
    this.soldier.root.add(ring);

    this.scene.add(this.soldier.root);
    this.resize(canvas.clientWidth, canvas.clientHeight);
  }

  resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
    this.locked = false;
    this.lockHeadings = [];
    this.stabilizer.reset();
    this.screenInitialized = false;
    this.faceYawInitialized = false;
    this.lastSample = null;
    this.displayOpacity = 0;
    this.yawDragRad = 0;
  }

  lockAnchor(headingDeg: number): void {
    this.worldBearing = worldBearingForDirection(headingDeg, this.direction);
    this.guardPos.copy(worldPositionFromBearing(this.worldBearing));
    this.locked = true;
  }

  setOrientationEvent(e: DeviceOrientationEvent): void {
    this.lastSample = this.stabilizer.push(e);

    if (!this.locked) {
      this.lockHeadings.push(this.lastSample.headingDeg);
      if (this.lockHeadings.length >= LOCK_SAMPLES_NEEDED) {
        this.lockAnchor(averageHeadingDeg(this.lockHeadings));
        this.lockHeadings = [];
      }
    }
  }

  setYawDragRad(rad: number): void {
    this.yawDragRad = this.locked ? 0 : rad;
  }

  setGuardScale(scale: number): void {
    this.guardUserScale = clampGuardScale(scale);
  }

  getGuardScale(): number {
    return this.guardUserScale;
  }

  private applyModelOpacity(opacity: number): void {
    if (Math.abs(opacity - this.lastMaterialOpacity) < 0.02) return;
    this.lastMaterialOpacity = opacity;
    this.soldier.root.traverse(child => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          m.opacity = opacity;
          m.transparent = opacity < 0.99;
        });
      }
    });
  }

  update(timeMs: number, canvasRect: DOMRect): ArSceneState {
    const hasCompass = this.lastSample != null;

    if (hasCompass) {
      quaternionFromDeviceSample(this.lastSample!, this.yawDragRad, this.targetQuat);
    }

    this.smoothQuat.slerp(this.targetQuat, hasCompass ? CAMERA_SLERP : 0);
    this.camera.quaternion.copy(this.smoothQuat);
    this.camera.position.copy(this.cameraPos);

    this.aimForward.set(0, 0, -1).applyQuaternion(this.smoothQuat).normalize();

    const turnDeg = this.locked
      ? horizontalTurnDeg(this.aimForward, this.cameraPos, this.guardPos)
      : 0;
    const absTurn = Math.abs(turnDeg);

    this.soldier.root.position.copy(this.guardPos);
    this.updateSoldierFacing();

    const targetOpacity =
      this.locked && hasCompass ? visibilityFromTurnDeg(turnDeg) : 0;
    this.displayOpacity += (targetOpacity - this.displayOpacity) * 0.18;

    this.idlePhase = timeMs * 0.001;
    const breathe = Math.sin(this.idlePhase * 1.5) * 0.005;
    this.soldier.root.scale.setScalar(SOLDIER_BASE_SCALE * this.guardUserScale * (1 + breathe));
    this.soldier.body.position.y = Math.sin(this.idlePhase * 1.1) * 0.005;
    this.soldier.cape.rotation.x = 0.12 + Math.sin(this.idlePhase * 2) * 0.04;

    const show = this.locked && hasCompass && absTurn < 78 && this.displayOpacity > 0.1;
    this.soldier.root.visible = show;
    if (show) this.applyModelOpacity(this.displayOpacity);

    this.renderer.render(this.scene, this.camera);

    this.headWorld.copy(this.guardPos);
    this.headWorld.y += GUARD_HEIGHT_M + 0.35;
    const proj = projectWorldToScreen(this.headWorld, this.camera, canvasRect);

    if (!this.screenInitialized && show && !proj.behind) {
      this.smoothScreenX = proj.x;
      this.smoothScreenY = proj.y;
      this.screenInitialized = true;
    }

    if (show && !proj.behind) {
      this.smoothScreenX += (proj.x - this.smoothScreenX) * 0.18;
      this.smoothScreenY += (proj.y - this.smoothScreenY) * 0.18;
    }

    const guardVisible = show && !proj.behind && this.displayOpacity > 0.45 && absTurn < 34;

    const bubbleAnchor = guardVisible
      ? buildBubbleAnchor(this.smoothScreenX, this.smoothScreenY, canvasRect, true, this.displayOpacity)
      : buildBubbleAnchor(0, 0, canvasRect, false, 0);

    return {
      bubbleAnchor,
      guardVisible,
      relativeBearingDeg: turnDeg,
      viewAngle: absTurn,
      worldBearing: this.worldBearing,
      hasCompass,
      anchorLocked: this.locked,
      guardScale: this.guardUserScale,
    };
  }

  private updateSoldierFacing(): void {
    const dx = this.cameraPos.x - this.guardPos.x;
    const dz = this.cameraPos.z - this.guardPos.z;
    const targetFace = Math.atan2(dx, dz);

    if (!this.faceYawInitialized) {
      this.smoothFaceYaw = targetFace;
      this.faceYawInitialized = true;
    } else {
      let diff = targetFace - this.smoothFaceYaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.smoothFaceYaw += diff * FACE_SLERP;
    }

    aimSoldierTowardCamera(this.soldier, this.smoothFaceYaw, this.direction);
  }

  dispose(): void {
    this.soldier.root.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat.dispose();
      }
    });
    this.renderer.dispose();
  }
}
