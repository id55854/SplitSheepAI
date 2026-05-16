import * as THREE from 'three';
import type { AvatarScreenAnchor } from '../avatarAnchor';
import { HIDDEN_ANCHOR } from '../avatarAnchor';

const _ndc = new THREE.Vector3();

export function projectWorldToScreen(
  worldPoint: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  canvasRect: DOMRect,
): { x: number; y: number; behind: boolean } {
  _ndc.copy(worldPoint).project(camera);
  return {
    x: canvasRect.left + (_ndc.x * 0.5 + 0.5) * canvasRect.width,
    y: canvasRect.top + (-_ndc.y * 0.5 + 0.5) * canvasRect.height,
    behind: _ndc.z > 1,
  };
}

export function buildBubbleAnchor(
  screenX: number,
  screenY: number,
  canvasRect: DOMRect,
  visible: boolean,
  opacity: number,
): AvatarScreenAnchor {
  if (!visible || opacity < 0.06) return HIDDEN_ANCHOR;

  const midX = canvasRect.left + canvasRect.width * 0.5;
  const guardOnLeft = screenX < midX;

  return {
    screenX,
    screenY,
    visible: true,
    opacity,
    /** Bubble sits beside the guard (opposite side from screen edge). */
    bubbleOnRight: guardOnLeft,
  };
}
