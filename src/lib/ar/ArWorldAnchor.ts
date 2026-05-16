import * as THREE from 'three';
import type { Direction } from '../../data/landmarks';

/** Added to compass heading when the landmark is first locked. */
const BEARING_OFFSET: Record<Direction, number> = {
  ravno: 0,
  lijevo: -32,
  desno: 32,
  natrag: 165,
};

export const GUARD_DISTANCE_M = 4.5;
export const GUARD_HEIGHT_M = 0.55;
/** Horizontal turn (degrees) within which the guard is fully visible. */
export const VIEW_CONE_DEG = 78;
export const LOCK_CONE_DEG = 32;

export function worldBearingForDirection(compassAtLockDeg: number, direction: Direction): number {
  let b = compassAtLockDeg + BEARING_OFFSET[direction];
  while (b < 0) b += 360;
  while (b >= 360) b -= 360;
  return b;
}

export function worldPositionFromBearing(bearingDeg: number): THREE.Vector3 {
  const rad = (bearingDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.sin(rad) * GUARD_DISTANCE_M,
    GUARD_HEIGHT_M,
    -Math.cos(rad) * GUARD_DISTANCE_M,
  );
}

const _toTarget = new THREE.Vector3();
const _forwardFlat = new THREE.Vector3();

/**
 * Horizontal turn toward a fixed world point.
 * Negative = turn left, positive = turn right. Same value drives arrow + visibility.
 */
export function horizontalTurnDeg(
  cameraForward: THREE.Vector3,
  cameraPosition: THREE.Vector3,
  targetPosition: THREE.Vector3,
): number {
  _toTarget.copy(targetPosition).sub(cameraPosition);
  _toTarget.y = 0;
  if (_toTarget.lengthSq() < 1e-6) return 0;
  _toTarget.normalize();

  _forwardFlat.copy(cameraForward);
  _forwardFlat.y = 0;
  if (_forwardFlat.lengthSq() < 1e-6) return 0;
  _forwardFlat.normalize();

  const cross = _forwardFlat.x * _toTarget.z - _forwardFlat.z * _toTarget.x;
  const dot = _forwardFlat.x * _toTarget.x + _forwardFlat.z * _toTarget.z;
  return (Math.atan2(cross, dot) * 180) / Math.PI;
}

export function visibilityFromTurnDeg(turnDeg: number): number {
  const angle = Math.abs(turnDeg);
  if (angle <= LOCK_CONE_DEG) return 1;
  if (angle >= VIEW_CONE_DEG) return 0;
  const t = (angle - LOCK_CONE_DEG) / (VIEW_CONE_DEG - LOCK_CONE_DEG);
  return 1 - t * t * (3 - 2 * t);
}
