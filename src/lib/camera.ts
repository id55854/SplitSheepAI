export type CameraFacing = 'environment' | 'user';

export interface CameraStreamResult {
  stream: MediaStream;
  facing: CameraFacing;
}

const BACK_LABEL = /back|rear|environment|stražn|zadnj|traseiro|arrière|wide/i;
const FRONT_LABEL = /front|user|selfie|prednj|facetime|true depth/i;

function isBackCamera(device: MediaDeviceInfo): boolean {
  return BACK_LABEL.test(device.label);
}

function isFrontCamera(device: MediaDeviceInfo): boolean {
  return FRONT_LABEL.test(device.label);
}

async function tryGetUserMedia(
  constraints: MediaTrackConstraints,
): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: constraints,
      audio: false,
    });
  } catch {
    return null;
  }
}

function getStreamFacing(stream: MediaStream): CameraFacing {
  const track = stream.getVideoTracks()[0];
  const mode = track?.getSettings().facingMode;
  if (mode === 'user') return 'user';
  return 'environment';
}

/** Rear camera on the phone — not laptop / Continuity webcam. */
export async function requestPhoneCameraStream(): Promise<CameraStreamResult | null> {
  if (!navigator.mediaDevices?.getUserMedia) return null;

  let stream =
    (await tryGetUserMedia({
      facingMode: { exact: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    })) ??
    (await tryGetUserMedia({
      facingMode: { ideal: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    }));

  if (stream) {
    return { stream, facing: getStreamFacing(stream) };
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(d => d.kind === 'videoinput');

    const back = cameras.find(isBackCamera);
    if (back?.deviceId) {
      stream = await tryGetUserMedia({
        deviceId: { exact: back.deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      });
      if (stream) return { stream, facing: 'environment' };
    }

    const notFront = cameras.find(d => d.deviceId && !isFrontCamera(d));
    if (notFront?.deviceId) {
      stream = await tryGetUserMedia({
        deviceId: { exact: notFront.deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      });
      if (stream) return { stream, facing: 'environment' };
    }
  } catch {
    /* ignore */
  }

  stream = await tryGetUserMedia({ facingMode: { ideal: 'environment' } });

  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      stream = null;
    }
  }

  if (stream) {
    return { stream, facing: getStreamFacing(stream) };
  }

  return null;
}

export function applyCameraVideoClass(video: HTMLVideoElement, facing: CameraFacing): void {
  video.classList.toggle('camera-video--front', facing === 'user');
}

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach(t => t.stop());
}
