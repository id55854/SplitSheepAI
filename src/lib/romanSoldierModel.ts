import * as THREE from 'three';
import type { Direction } from '../data/landmarks';
import { GUARD_PLACEMENT } from './avatarPlacement';

export interface RomanSoldierParts {
  root: THREE.Group;
  body: THREE.Group;
  cape: THREE.Mesh;
  pointingArm: THREE.Group;
  plume: THREE.Mesh;
  shadow: THREE.Mesh;
}

const STEEL = 0xb4bcc6;
const STEEL_BRIGHT = 0xd8dee6;
const STEEL_DARK = 0x88929c;
const BRASS = 0xc9a227;
const TUNIC_RED = 0x8b1a1a;
const CAPE_RED = 0x7a1515;
const SKIN = 0xc4865a;
const SKIN_SHADOW = 0xa86f48;
const LEATHER = 0x5c3d20;
const WOOD = 0x6b4a28;
const HAIR = 0x3d2818;
const EYE_WHITE = 0xf5f0e8;
const EYE_IRIS = 0x4a3520;

function metal(color = STEEL, roughness = 0.32, metalness = 0.88): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function fabric(color: number, roughness = 0.9): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function skin(color = SKIN): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 });
}

function leatherMat(color = LEATHER): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.04 });
}

function mesh<T extends THREE.BufferGeometry>(geo: T, mat: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(geo, mat);
}

function buildFace(headGroup: THREE.Group): void {
  const head = mesh(new THREE.SphereGeometry(0.19, 16, 14), skin());
  head.scale.set(0.95, 1.05, 0.92);
  head.position.y = 0.68;
  headGroup.add(head);

  const jaw = mesh(new THREE.SphereGeometry(0.12, 10, 8), skin(SKIN_SHADOW));
  jaw.scale.set(1.1, 0.7, 0.85);
  jaw.position.set(0, 0.6, 0.04);
  headGroup.add(jaw);

  for (const side of [-1, 1] as const) {
    const eyeWhite = mesh(new THREE.SphereGeometry(0.028, 8, 6), new THREE.MeshStandardMaterial({ color: EYE_WHITE, roughness: 0.4 }));
    eyeWhite.scale.set(1.2, 0.85, 0.6);
    eyeWhite.position.set(side * 0.065, 0.72, 0.14);
    const pupil = mesh(new THREE.SphereGeometry(0.012, 6, 5), new THREE.MeshStandardMaterial({ color: EYE_IRIS, roughness: 0.5 }));
    pupil.position.set(side * 0.065, 0.72, 0.165);
    headGroup.add(eyeWhite, pupil);

    const brow = mesh(new THREE.BoxGeometry(0.055, 0.012, 0.02), new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.9 }));
    brow.position.set(side * 0.065, 0.755, 0.13);
    brow.rotation.z = side * 0.15;
    headGroup.add(brow);
  }

  const nose = mesh(new THREE.BoxGeometry(0.035, 0.05, 0.04), skin(SKIN_SHADOW));
  nose.position.set(0, 0.67, 0.155);
  headGroup.add(nose);

  const smile = mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 12, Math.PI * 0.85), new THREE.MeshStandardMaterial({ color: 0x9a5040, roughness: 0.85 }));
  smile.rotation.x = Math.PI / 2;
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.615, 0.14);
  headGroup.add(smile);

  for (const side of [-1, 1] as const) {
    const ear = mesh(new THREE.SphereGeometry(0.035, 6, 5), skin());
    ear.scale.set(0.5, 1, 0.7);
    ear.position.set(side * 0.17, 0.67, 0.02);
    headGroup.add(ear);
  }
}

function buildHelmet(headGroup: THREE.Group): void {
  const dome = mesh(
    new THREE.SphereGeometry(0.26, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    metal(STEEL_BRIGHT, 0.28, 0.92),
  );
  dome.position.y = 0.86;
  headGroup.add(dome);

  const browPlate = mesh(new THREE.BoxGeometry(0.5, 0.055, 0.22), metal(STEEL_DARK, 0.35, 0.85));
  browPlate.position.set(0, 0.8, 0.1);
  headGroup.add(browPlate);

  for (const side of [-1, 1] as const) {
    const cheek = mesh(new THREE.BoxGeometry(0.09, 0.17, 0.12), metal(STEEL, 0.34, 0.86));
    cheek.position.set(side * 0.2, 0.7, 0.08);
    cheek.rotation.y = side * 0.25;
    headGroup.add(cheek);
    const brassTrim = mesh(new THREE.BoxGeometry(0.02, 0.14, 0.13), metal(BRASS, 0.3, 0.95));
    brassTrim.position.set(side * 0.24, 0.7, 0.08);
    headGroup.add(brassTrim);
  }

  const neckGuard = mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.08, 12), metal(STEEL_DARK, 0.38, 0.8));
  neckGuard.position.y = 0.58;
  headGroup.add(neckGuard);
}

/** 3D legionary — original low-poly style, face/body shaped like reference guard. */
export function createRomanSoldier(): RomanSoldierParts {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const shadow = mesh(
    new THREE.CircleGeometry(0.62, 28),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.05;
  root.add(shadow);

  const tunicSkirt = mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.48, 12), fabric(TUNIC_RED));
  tunicSkirt.position.y = -0.44;
  body.add(tunicSkirt);

  const chest = mesh(new THREE.BoxGeometry(0.52, 0.2, 0.28), fabric(TUNIC_RED));
  chest.position.y = 0.28;
  body.add(chest);

  const armorGroup = new THREE.Group();
  armorGroup.position.y = 0.1;
  for (let row = 0; row < 6; row++) {
    const curve = 0.42 - row * 0.018;
    const band = mesh(
      new THREE.BoxGeometry(0.82, 0.075, curve),
      metal(row % 2 === 0 ? STEEL_BRIGHT : STEEL, 0.3 + row * 0.02, 0.86),
    );
    band.position.y = 0.28 - row * 0.11;
    band.position.z = 0.02;
    armorGroup.add(band);
    const hinge = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.44, 6), metal(BRASS, 0.28, 0.95));
    hinge.rotation.x = Math.PI / 2;
    hinge.position.set(0, 0.28 - row * 0.11, 0.02);
    armorGroup.add(hinge);
  }
  body.add(armorGroup);

  for (const side of [-1, 1] as const) {
    const pauldron = mesh(new THREE.SphereGeometry(0.19, 12, 10), metal(STEEL_BRIGHT, 0.32, 0.88));
    pauldron.scale.set(1.15, 0.8, 1.05);
    pauldron.position.set(side * 0.48, 0.4, 0.02);
    body.add(pauldron);
    const strap = mesh(new THREE.BoxGeometry(0.06, 0.35, 0.08), leatherMat());
    strap.position.set(side * 0.42, 0.22, -0.08);
    body.add(strap);
  }

  const neck = mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.12, 10), skin());
  neck.position.y = 0.52;
  body.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.y = 0;
  buildFace(headGroup);
  buildHelmet(headGroup);
  body.add(headGroup);

  const plume = mesh(new THREE.ConeGeometry(0.04, 0.14, 6), fabric(0x6b1010));
  plume.position.set(0, 1.05, -0.04);
  body.add(plume);

  const cape = mesh(new THREE.PlaneGeometry(1.1, 1.3, 1, 4), fabric(CAPE_RED));
  cape.position.set(0, 0.18, -0.34);
  cape.rotation.x = 0.12;
  body.add(cape);
  for (const x of [-0.14, 0.14]) {
    const fibula = mesh(new THREE.TorusGeometry(0.045, 0.014, 6, 14), metal(BRASS, 0.25, 0.96));
    fibula.position.set(x, 0.46, -0.2);
    fibula.rotation.y = Math.PI / 2;
    body.add(fibula);
  }

  const belt = mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.09, 14), leatherMat());
  belt.position.y = -0.1;
  body.add(belt);
  for (let i = -2; i <= 2; i++) {
    const strip = mesh(new THREE.BoxGeometry(0.1, 0.3, 0.05), leatherMat(0x6b4828));
    strip.position.set(i * 0.13, -0.27, 0.1);
    body.add(strip);
    const stud = mesh(new THREE.SphereGeometry(0.015, 5, 4), metal(BRASS, 0.3, 0.95));
    stud.position.set(i * 0.13, -0.18, 0.12);
    body.add(stud);
  }

  const scabbard = mesh(new THREE.BoxGeometry(0.07, 0.45, 0.09), leatherMat());
  scabbard.position.set(-0.34, -0.02, 0.18);
  scabbard.rotation.z = 0.22;
  body.add(scabbard);
  const scabbardTrim = mesh(new THREE.BoxGeometry(0.02, 0.4, 0.1), metal(BRASS, 0.3, 0.92));
  scabbardTrim.position.set(-0.31, -0.02, 0.19);
  scabbardTrim.rotation.z = 0.22;
  body.add(scabbardTrim);

  const spearGroup = new THREE.Group();
  spearGroup.position.set(0.4, 0.15, 0.04);
  const shaft = mesh(
    new THREE.CylinderGeometry(0.02, 0.026, 1.6, 8),
    new THREE.MeshStandardMaterial({ color: WOOD, roughness: 0.88 }),
  );
  shaft.position.y = 0.48;
  const pilumHead = mesh(new THREE.ConeGeometry(0.045, 0.22, 8), metal(0xdce2e8, 0.25, 0.94));
  pilumHead.position.y = 1.26;
  spearGroup.add(shaft, pilumHead);
  body.add(spearGroup);

  const pointingArm = new THREE.Group();
  pointingArm.position.set(-0.42, 0.36, 0.08);
  const upperL = mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.3, 10), fabric(TUNIC_RED));
  upperL.rotation.z = Math.PI / 2.15;
  upperL.position.set(-0.12, 0.02, 0);
  const foreL = mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.34, 10), skin());
  foreL.rotation.z = Math.PI / 2.05;
  foreL.position.set(-0.4, 0.04, 0);
  const bracer = mesh(new THREE.CylinderGeometry(0.078, 0.082, 0.12, 8), leatherMat());
  bracer.rotation.z = Math.PI / 2.05;
  bracer.position.set(-0.52, 0.04, 0);
  const handL = mesh(new THREE.SphereGeometry(0.065, 8, 6), skin());
  handL.position.set(-0.64, 0.04, 0.02);
  handL.scale.set(0.9, 0.85, 0.7);
  pointingArm.add(upperL, foreL, bracer, handL);
  body.add(pointingArm);

  const spearArm = new THREE.Group();
  spearArm.position.set(0.36, 0.32, 0.06);
  const upperR = mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.28, 10), fabric(TUNIC_RED));
  upperR.rotation.z = -0.35;
  upperR.position.set(0.08, -0.05, 0);
  const foreR = mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.3, 10), skin());
  foreR.rotation.z = -0.2;
  foreR.position.set(0.22, -0.2, 0);
  spearArm.add(upperR, foreR);
  body.add(spearArm);

  for (const side of [-1, 1] as const) {
    const leg = mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.55, 10), fabric(TUNIC_RED));
    leg.position.set(side * 0.16, -0.76, 0.02);
    const greave = mesh(new THREE.BoxGeometry(0.13, 0.28, 0.15), metal(STEEL_DARK, 0.38, 0.82));
    greave.position.set(side * 0.16, -0.8, 0.05);
    body.add(leg, greave);
    for (let s = 0; s < 3; s++) {
      const strap = mesh(new THREE.BoxGeometry(0.2, 0.02, 0.04), leatherMat());
      strap.position.set(side * 0.16, -0.95 + s * 0.06, 0.1 + s * 0.02);
      body.add(strap);
    }
    const sandal = mesh(new THREE.BoxGeometry(0.22, 0.06, 0.3), leatherMat());
    sandal.position.set(side * 0.16, -1.03, 0.08);
    body.add(sandal);
  }

  root.scale.setScalar(1.12);

  return { root, body, cape, pointingArm, plume, shadow };
}

export function aimSoldierForDirection(parts: RomanSoldierParts, direction: Direction): void {
  const p = GUARD_PLACEMENT[direction];
  parts.root.rotation.y = p.faceYaw;
  parts.pointingArm.rotation.y = THREE.MathUtils.clamp(p.pointYaw, -1.35, 1.35);
  parts.pointingArm.rotation.x = -0.05;
  parts.pointingArm.rotation.z = -Math.PI / 2.1;
}

const POINT_ARM_BY_DIRECTION: Record<Direction, number> = {
  ravno: 0,
  lijevo: -0.85,
  desno: 0.85,
  natrag: Math.PI * 0.65,
};

/** Face the user in world space; point arm along route direction. */
export function aimSoldierTowardCamera(
  parts: RomanSoldierParts,
  faceYawRad: number,
  direction: Direction,
): void {
  parts.root.rotation.y = faceYawRad;
  const pointLocal = POINT_ARM_BY_DIRECTION[direction];
  parts.pointingArm.rotation.y = THREE.MathUtils.clamp(pointLocal, -1.35, 1.35);
  parts.pointingArm.rotation.x = -0.05;
  parts.pointingArm.rotation.z = -Math.PI / 2.1;
}
