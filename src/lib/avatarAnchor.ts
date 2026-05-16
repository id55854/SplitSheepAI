/** Screen-space anchor for UI pinned to the 3D guard. */
export interface AvatarScreenAnchor {
  screenX: number;
  screenY: number;
  visible: boolean;
  opacity: number;
  /** Bubble sits to the right of the anchor point (tail on left). */
  bubbleOnRight: boolean;
}

export const HIDDEN_ANCHOR: AvatarScreenAnchor = {
  screenX: 0,
  screenY: 0,
  visible: false,
  opacity: 0,
  bubbleOnRight: true,
};
