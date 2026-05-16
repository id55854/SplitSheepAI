import * as THREE from 'three';
import { getCompassHeading } from '../deviceOrientation';

const ZEE = new THREE.Vector3(0, 0, 1);
const EULER = new THREE.Euler();
const Q0 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const Q1 = new THREE.Quaternion();
const DEG = Math.PI / 180;

export interface OrientationSample {
  /** True-north compass (for locking guard bearing). */
  headingDeg: number;
  alphaRad: number;
  betaRad: number;
  gammaRad: number;
  screenOrientRad: number;
}

export class OrientationStabilizer {
  private headingDeg = 0;
  private initialized = false;
  private readonly headingSmooth: number;

  constructor(headingSmooth = 0.14) {
    this.headingSmooth = headingSmooth;
  }

  push(e: DeviceOrientationEvent, screenOrientationDeg = window.orientation ?? 0): OrientationSample {
    const rawHeading = getCompassHeading(e);
    const rawAlpha = e.alpha ?? rawHeading;
    const rawBeta = e.beta ?? 55;
    const rawGamma = e.gamma ?? 0;

    if (!this.initialized) {
      this.headingDeg = rawHeading;
      this.initialized = true;
    } else {
      this.headingDeg = smoothAngleDeg(this.headingDeg, rawHeading, this.headingSmooth);
    }

    return {
      headingDeg: this.headingDeg,
      alphaRad: rawAlpha * DEG,
      betaRad: clamp(rawBeta, 35, 75) * DEG,
      gammaRad: clamp(rawGamma, -30, 30) * 0.4 * DEG,
      screenOrientRad: screenOrientationDeg * DEG,
    };
  }

  reset(): void {
    this.initialized = false;
  }
}

function shortestAngleDeltaDeg(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

function smoothAngleDeg(current: number, target: number, factor: number): number {
  const diff = shortestAngleDeltaDeg(current, target);
  let next = current + diff * factor;
  while (next < 0) next += 360;
  while (next >= 360) next -= 360;
  return next;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** THREE.js DeviceOrientationControls-style camera quaternion. */
export function quaternionFromDeviceSample(
  sample: OrientationSample,
  yawOffsetRad = 0,
  out = new THREE.Quaternion(),
): THREE.Quaternion {
  EULER.set(sample.betaRad, sample.alphaRad + yawOffsetRad, -sample.gammaRad, 'YXZ');
  out.setFromEuler(EULER);
  out.multiply(Q1.setFromAxisAngle(ZEE, -sample.screenOrientRad));
  out.multiply(Q0);
  return out;
}
