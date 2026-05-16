import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import type { Direction, Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import { ArSceneController, type ArGuidanceState } from '../lib/ar/ArSceneController';
import type { AvatarScreenAnchor } from '../lib/avatarAnchor';
import { HIDDEN_ANCHOR } from '../lib/avatarAnchor';
import {
  needsOrientationPermission,
  requestDeviceOrientationPermission,
} from '../lib/deviceOrientation';
import SoldierAvatar from './SoldierAvatar';
import SpeechBubble from './SpeechBubble';

export interface Avatar3DOverlayHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getSpeechBubbleEl: () => HTMLDivElement | null;
  getAnchor: () => AvatarScreenAnchor;
}

interface Props {
  direction: Direction;
  language: Language;
  speechText: string;
  landmarkName: string;
  speechKey: number;
  onPlayVoice?: () => void;
  playVoiceLabel?: string;
  onGuardVisibilityChange?: (visible: boolean) => void;
  onGuidanceChange?: (guidance: ArGuidanceState) => void;
}

function canUseWebGL(): boolean {
  try {
    const test = document.createElement('canvas');
    return !!(test.getContext('webgl') || test.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

const Avatar3DOverlay = forwardRef<Avatar3DOverlayHandle, Props>(function Avatar3DOverlay(
  {
    direction,
    language,
    speechText,
    landmarkName,
    speechKey,
    onPlayVoice,
    playVoiceLabel,
    onGuardVisibilityChange,
    onGuidanceChange,
  },
  ref,
) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ArSceneController | null>(null);

  const [useFallback, setUseFallback] = useState(() => !canUseWebGL());
  const [bubbleAnchor, setBubbleAnchor] = useState<AvatarScreenAnchor>(HIDDEN_ANCHOR);
  const bubbleAnchorRef = useRef<AvatarScreenAnchor>(HIDDEN_ANCHOR);
  const [compassPending, setCompassPending] = useState(needsOrientationPermission());
  const [hint, setHint] = useState<'compass' | 'turn' | 'hidden'>('compass');
  const directionRef = useRef(direction);
  const dragYawRef = useRef(0);

  directionRef.current = direction;

  useImperativeHandle(
    ref,
    () => ({
      getCanvas: () => (useFallback ? null : canvasRef.current),
      getSpeechBubbleEl: () => speechBubbleRef.current,
      getAnchor: () => bubbleAnchorRef.current,
    }),
    [useFallback],
  );

  const publishFrame = useCallback(
    (next: AvatarScreenAnchor, state: ArGuidanceState) => {
      bubbleAnchorRef.current = next;
      setBubbleAnchor(next);
      onGuardVisibilityChange?.(state.guardVisible);
      onGuidanceChange?.(state);
      if (state.guardVisible) setHint('hidden');
      else if (!compassPending && state.hasCompass) setHint('turn');
    },
    [onGuardVisibilityChange, onGuidanceChange, compassPending],
  );

  const requestOrientation = useCallback(async () => {
    const ok = await requestDeviceOrientationPermission();
    setCompassPending(false);
    return ok;
  }, []);

  useEffect(() => {
    if (useFallback) return;
    sceneRef.current?.setDirection(direction);
  }, [direction, speechKey, useFallback]);

  useEffect(() => {
    if (useFallback) return;

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    let disposed = false;
    let raf = 0;

    try {
      sceneRef.current = new ArSceneController(canvas);
    } catch {
      setUseFallback(true);
      return;
    }

    const scene = sceneRef.current;
    scene.setDirection(directionRef.current);

    const resize = () => {
      const parent = overlay.parentElement;
      const w = parent?.clientWidth ?? overlay.clientWidth;
      const h = parent?.clientHeight ?? overlay.clientHeight;
      scene.resize(w, h);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      scene.setOrientationEvent(e);
    };

    const onOrientationAbsolute = (e: DeviceOrientationEvent) => {
      if (e.alpha != null) scene.setOrientationEvent(e);
    };

    let dragPointerId: number | null = null;
    let lastDragX = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragPointerId = e.pointerId;
      lastDragX = e.clientX;
      void requestOrientation();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragPointerId !== e.pointerId) return;
      const dx = e.clientX - lastDragX;
      lastDragX = e.clientX;
      dragYawRef.current = THREE.MathUtils.clamp(dragYawRef.current - dx * 0.0025, -0.85, 0.85);
      scene.setYawDragRad(dragYawRef.current);
    };

    const endDrag = (e: PointerEvent) => {
      if (dragPointerId === e.pointerId) dragPointerId = null;
    };

    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointermove', onPointerMove);
    overlay.addEventListener('pointerup', endDrag);
    overlay.addEventListener('pointercancel', endDrag);
    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('deviceorientationabsolute', onOrientationAbsolute, true);
    window.addEventListener('resize', resize);

    const ro = new ResizeObserver(resize);
    ro.observe(overlay.parentElement ?? overlay);
    resize();

    if (!needsOrientationPermission()) {
      setCompassPending(false);
    } else {
      const id = window.setTimeout(() => void requestOrientation(), 700);
      window.setTimeout(() => window.clearTimeout(id), 800);
    }

    const tick = (time: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const rect = canvas.getBoundingClientRect();
      const state = scene.update(time, rect);
      publishFrame(state.bubbleAnchor, state);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('deviceorientation', onOrientation, true);
      window.removeEventListener('deviceorientationabsolute', onOrientationAbsolute, true);
      window.removeEventListener('resize', resize);
      overlay.removeEventListener('pointerdown', onPointerDown);
      overlay.removeEventListener('pointermove', onPointerMove);
      overlay.removeEventListener('pointerup', endDrag);
      overlay.removeEventListener('pointercancel', endDrag);
      scene.dispose();
      sceneRef.current = null;
      publishFrame(HIDDEN_ANCHOR, {
        relativeBearingDeg: 0,
        viewAngle: 180,
        guardVisible: false,
        worldBearing: 0,
        hasCompass: false,
        anchorLocked: false,
        guardScale: 1,
      });
    };
  }, [useFallback, publishFrame, requestOrientation]);

  useEffect(() => {
    if (!useFallback) return;
    let raf = 0;
    const tick = () => {
      const soldier = overlayRef.current?.querySelector('.soldier-svg-wrap');
      if (soldier) {
        const r = soldier.getBoundingClientRect();
        publishFrame(
          {
            screenX: r.right,
            screenY: r.top + r.height * 0.5,
            visible: true,
            opacity: 1,
            bubbleOnRight: true,
          },
          {
            relativeBearingDeg: 0,
            viewAngle: 0,
            guardVisible: true,
            worldBearing: 0,
            hasCompass: true,
            guardScale: 1,
            anchorLocked: true,
          },
        );
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [useFallback, publishFrame]);

  const speechBubble = (
    <SpeechBubble
      ref={speechBubbleRef}
      key={`${landmarkName}-${speechKey}`}
      text={speechText}
      landmarkName={landmarkName}
      anchor={bubbleAnchor}
      onPlayVoice={onPlayVoice}
      playVoiceLabel={playVoiceLabel}
    />
  );

  if (useFallback) {
    return (
      <div ref={overlayRef} className="avatar-3d-overlay avatar-3d-overlay--fallback">
        <div className="fallback-guard-row">
          <SoldierAvatar />
        </div>
        {speechBubble}
      </div>
    );
  }

  return (
    <div ref={overlayRef} className="avatar-3d-overlay">
      <canvas ref={canvasRef} id="avatar-3d-canvas" className="avatar-3d-canvas" aria-hidden />
      {speechBubble}
      {compassPending && (
        <button type="button" className="ar-hud-btn" onClick={() => void requestOrientation()}>
          {t('compassEnable3d', language)}
        </button>
      )}
      {hint === 'turn' && (
        <p className="ar-hud-hint">{t('anchorHint', language)}</p>
      )}
    </div>
  );
});

export default Avatar3DOverlay;
