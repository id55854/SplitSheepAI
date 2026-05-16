import type { Direction } from '../data/landmarks';

/** Screen-space placement: guard always in front of the camera. */
export interface GuardPlacement {
  x: number;
  z: number;
  /** World yaw (radians) — body faces the user. */
  faceYaw: number;
  /** Local arm point angle (radians). */
  pointYaw: number;
}

export const GUARD_PLACEMENT: Record<Direction, GuardPlacement> = {
  ravno: { x: 0, z: 0, faceYaw: 0, pointYaw: 0 },
  lijevo: { x: -1.15, z: 0.15, faceYaw: 0.35, pointYaw: -1.05 },
  desno: { x: 1.15, z: 0.15, faceYaw: -0.35, pointYaw: 1.05 },
  natrag: { x: 0, z: 0.55, faceYaw: Math.PI, pointYaw: Math.PI },
};
