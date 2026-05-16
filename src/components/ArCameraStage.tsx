import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import {
  applyCameraVideoClass,
  requestPhoneCameraStream,
  stopStream,
  type CameraFacing,
} from '../lib/camera';
import { isSecureForCamera } from '../lib/device';

export interface ArCameraStageHandle {
  getVideo: () => HTMLVideoElement | null;
  getCameraContainer: () => HTMLDivElement | null;
  isFrontCamera: () => boolean;
  isDemo: () => boolean;
}

interface Props {
  onReady: (isDemo: boolean) => void;
  children?: ReactNode;
}

const ArCameraStage = forwardRef<ArCameraStageHandle, Props>(function ArCameraStage(
  { onReady, children },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<'loading' | 'active' | 'demo'>('loading');
  const [facing, setFacing] = useState<CameraFacing>('environment');

  useImperativeHandle(ref, () => ({
    getVideo: () => videoRef.current,
    getCameraContainer: () => containerRef.current,
    isFrontCamera: () => facing === 'user',
    isDemo: () => status === 'demo',
  }));

  useEffect(() => {
    let cancelled = false;
    const ready = (isDemo: boolean) => onReady(isDemo);

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setStatus('demo');
          ready(true);
        }
        return;
      }

      if (!isSecureForCamera()) {
        if (!cancelled) {
          setStatus('demo');
          ready(true);
        }
        return;
      }

      const result = await requestPhoneCameraStream();
      if (cancelled) {
        stopStream(result?.stream ?? null);
        return;
      }

      if (!result || !videoRef.current) {
        setStatus('demo');
        ready(true);
        return;
      }

      streamRef.current = result.stream;
      setFacing(result.facing);
      const video = videoRef.current;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;
      video.playsInline = true;
      video.srcObject = result.stream;

      const onPlaying = () => {
        if (cancelled) return;
        applyCameraVideoClass(video, result.facing);
        setStatus('active');
        ready(false);
      };

      video.onloadedmetadata = () => {
        applyCameraVideoClass(video, result.facing);
        video.play().then(onPlaying).catch(onPlaying);
      };
    }

    startCamera();
    return () => {
      cancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'active') return;
    const refresh = () => applyCameraVideoClass(video, facing);
    window.addEventListener('orientationchange', refresh);
    window.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('orientationchange', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, [status, facing]);

  return (
    <div ref={containerRef} className="camera-stage" data-camera-status={status}>
      {status === 'demo' ? (
        <div className="demo-bg">
          <div className="demo-label">Demo Mode</div>
          {!isSecureForCamera() && (
            <p className="demo-hint">Kamera treba HTTPS — otvori https:// link s Vite terminala</p>
          )}
        </div>
      ) : (
        <>
          {status === 'loading' && (
            <div className="demo-bg">
              <div className="demo-label">Pokretanje kamere...</div>
            </div>
          )}
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
            disablePictureInPicture
            style={{ opacity: status === 'active' ? 1 : 0 }}
          />
        </>
      )}
      <div className="camera-stage-ar">{children}</div>
    </div>
  );
});

export default ArCameraStage;
