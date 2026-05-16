import * as THREE from 'three';
import type { Direction } from '../data/landmarks';
import { normalizeDegrees, shortestAngleDelta } from './deviceOrientation';

/** Horizontal offset (degrees) where the soldier is anchored in the world. */
const ANCHOR_OFFSET: Record<Direction, number> = {
  ravno: 0,
  lijevo: -45,
  desno: 45,
  natrag: 155,
};

const POINT_OFFSET: Record<Direction, number> = { ...ANCHOR_OFFSET };

export const ANCHOR_DISTANCE_M = 5;
export const AVATAR_EYE_HEIGHT_M = 1.65;
/** Max angle (degrees) between phone look direction and guard to show avatar. */
export const VISIBLE_VIEW_ANGLE = 52;

export function anchorBearingFromCompass(compassDeg: number, direction: Direction): number {
  return normalizeDegrees(compassDeg + ANCHOR_OFFSET[direction]);
}

export function pointingBearingFromAnchor(anchorBearingDeg: number, direction: Direction): number {
  return normalizeDegrees(anchorBearingDeg + (POINT_OFFSET[direction] - ANCHOR_OFFSET[direction]));
}

export function relativeBearingToAnchor(
  anchorBearingDeg: number,
  currentCompassDeg: number,
): number {
  return shortestAngleDelta(currentCompassDeg, anchorBearingDeg);
}

/** Fixed world position from absolute compass bearing (does not move when phone turns). */
export function anchorWorldPositionFromBearing(
  anchorBearingDeg: number,
  distance = ANCHOR_DISTANCE_M,
): { x: number; y: number; z: number } {
  const rad = (anchorBearingDeg * Math.PI) / 180;
  return {
    x: Math.sin(rad) * distance,
    y: AVATAR_EYE_HEIGHT_M - 1.05,
    z: -Math.cos(rad) * distance,
  };
}

/** @deprecated Use bearing-based world position */
export function anchorWorldPosition(relativeBearingDeg: number, distance = ANCHOR_DISTANCE_M) {
  return anchorWorldPositionFromBearing(relativeBearingDeg, distance);
}

export function viewingAngleDeg(
  camera: THREE.PerspectiveCamera,
  cameraPosition: THREE.Vector3,
  avatarPosition: THREE.Vector3,
): { angle: number; inFront: boolean } {
  const toAvatar = avatarPosition.clone().sub(cameraPosition);
  const dist = toAvatar.length();
  if (dist < 0.01) return { angle: 0, inFront: true };
  toAvatar.normalize();
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const dot = forward.dot(toAvatar);
  return {
    angle: (Math.acos(Math.min(1, Math.max(-1, dot))) * 180) / Math.PI,
    inFront: dot > 0.08,
  };
}

export function isAnchorInViewAngle(angleDeg: number, inFront: boolean): boolean {
  return inFront && angleDeg < VISIBLE_VIEW_ANGLE;
}

/** Fallback when compass unavailable: compare drag bearing to anchor. */
export function isAnchorInViewByRelativeBearing(relativeBearingDeg: number): boolean {
  return Math.abs(relativeBearingDeg) < VISIBLE_VIEW_ANGLE;
}

export function viewFadeFromAngle(angleDeg: number): number {
  const edge = VISIBLE_VIEW_ANGLE;
  if (angleDeg >= edge + 10) return 0;
  if (angleDeg <= edge - 15) return 1;
  return 1 - (angleDeg - (edge - 15)) / 25;
}

/** @deprecated */
export function isAnchorInView(relativeBearingDeg: number, _betaDeg: number): boolean {
  return isAnchorInViewByRelativeBearing(relativeBearingDeg);
}

/** @deprecated */
export function viewFade(relativeBearingDeg: number): number {
  return viewFadeFromAngle(Math.abs(relativeBearingDeg));
}
