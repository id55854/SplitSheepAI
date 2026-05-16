/** Compass + attitude helpers for world-anchored AR overlay. */

export interface DeviceAttitude {
  /** True-north compass heading in degrees (0–360). */
  compass: number;
  beta: number;
  gamma: number;
  alpha: number;
}

let hasReceivedOrientation = false;

export function markOrientationReceived(): void {
  hasReceivedOrientation = true;
}

export function hasOrientationReading(): boolean {
  return hasReceivedOrientation;
}

export function needsOrientationPermission(): boolean {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (
      DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    ).requestPermission === 'function'
  );
}

export async function requestDeviceOrientationPermission(): Promise<boolean> {
  try {
    if (needsOrientationPermission()) {
      const perm = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<'granted' | 'denied' | 'default'>;
        }
      ).requestPermission();
      return perm === 'granted';
    }
    return typeof DeviceOrientationEvent !== 'undefined';
  } catch {
    return false;
  }
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Read compass heading; prefers iOS webkitCompassHeading. */
export function getCompassHeading(e: DeviceOrientationEvent): number {
  const ios = (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
    .webkitCompassHeading;
  if (ios != null && !Number.isNaN(ios)) return ios;
  if (e.alpha != null && !Number.isNaN(e.alpha)) {
    return (360 - e.alpha + 360) % 360;
  }
  return 0;
}

/** Circular mean of compass headings in degrees. */
export function averageHeadingDeg(angles: number[]): number {
  if (angles.length === 0) return 0;
  let sx = 0;
  let cz = 0;
  for (const a of angles) {
    const r = (a * Math.PI) / 180;
    sx += Math.sin(r);
    cz += Math.cos(r);
  }
  return normalizeDegrees((Math.atan2(sx, cz) * 180) / Math.PI);
}

export function readDeviceAttitude(e: DeviceOrientationEvent): DeviceAttitude {
  if (e.alpha != null || (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading != null) {
    markOrientationReceived();
  }
  return {
    compass: getCompassHeading(e),
    beta: e.beta ?? 50,
    gamma: e.gamma ?? 0,
    alpha: e.alpha ?? 0,
  };
}

export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/** Shortest signed difference from→to in degrees (−180…180). */
export function shortestAngleDelta(fromDeg: number, toDeg: number): number {
  let diff = normalizeDegrees(toDeg) - normalizeDegrees(fromDeg);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

/**
 * Rotate camera with device tilt + compass heading.
 * Avatar stays at a fixed world bearing; only the camera moves.
 */
export function applyDeviceRotationToCamera(
  camera: {
    rotation: {
      set: (x: number, y: number, z: number) => void;
      order: string;
    };
  },
  attitude: DeviceAttitude,
  screenOrientationDeg = 0,
): void {
  const heading = attitude.compass;
  const beta = THREE_CLAMP(attitude.beta ?? 50, 15, 85);
  const gamma = attitude.gamma ?? 0;

  const yaw = ((heading + screenOrientationDeg) * Math.PI) / 180;
  const pitch = (beta * Math.PI) / 180;
  const roll = (-gamma * Math.PI) / 180;

  camera.rotation.order = 'YXZ';
  camera.rotation.set(pitch, yaw, roll);
}

function THREE_CLAMP(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
