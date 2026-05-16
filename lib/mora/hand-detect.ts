// MediaPipe Hands wrapper. Loads the HandLandmarker model from CDN once,
// runs per-frame detection on a <video> element, and exposes a stable
// extended-finger count (0–5).

import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

let landmarker: HandLandmarker | null = null;
let loadingPromise: Promise<HandLandmarker> | null = null;

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export async function loadHandLandmarker(): Promise<HandLandmarker> {
  if (landmarker) return landmarker;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE);
    landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return landmarker;
  })();
  return loadingPromise;
}

// MediaPipe hand landmark indices (https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
// 0 = WRIST
// 1..4 = THUMB CMC, MCP, IP, TIP
// 5..8 = INDEX MCP, PIP, DIP, TIP
// 9..12 = MIDDLE
// 13..16 = RING
// 17..20 = PINKY

type Pt = { x: number; y: number; z?: number };

export function countExtendedFingers(landmarks: Pt[]): number {
  if (!landmarks || landmarks.length < 21) return 0;
  let n = 0;
  const wrist = landmarks[0];

  // Thumb: tip horizontal distance from wrist > IP distance from wrist
  // (works for both left and right hands regardless of mirroring).
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  const thumbExtended =
    Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbIP.x - wrist.x) + 0.02;
  if (thumbExtended) n++;

  // Other fingers: tip y < PIP y - margin → extended upward.
  // (y axis is 0 at top, 1 at bottom in MediaPipe coords.)
  const pairs: Array<[number, number]> = [
    [8, 6], // index
    [12, 10], // middle
    [16, 14], // ring
    [20, 18], // pinky
  ];
  for (const [tip, pip] of pairs) {
    if (landmarks[tip].y < landmarks[pip].y - 0.02) n++;
  }
  return n;
}
