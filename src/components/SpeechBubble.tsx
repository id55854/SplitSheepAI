import { forwardRef, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { AvatarScreenAnchor } from '../lib/avatarAnchor';
import { isSpeechSupported } from '../lib/speech';

interface Props {
  text: string;
  landmarkName: string;
  anchor?: AvatarScreenAnchor;
  onPlayVoice?: () => void;
  playVoiceLabel?: string;
  showPlayButton?: boolean;
}

const SpeechBubble = forwardRef<HTMLDivElement, Props>(function SpeechBubble(
  {
    text,
    landmarkName,
    anchor,
    onPlayVoice,
    playVoiceLabel = '🔊 Glas',
    showPlayButton = true,
  },
  ref,
) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const canSpeak = isSpeechSupported() && showPlayButton && onPlayVoice;

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [text]);

  const show = anchor ? anchor.visible && anchor.opacity > 0.08 : true;

  const wrapStyle = useMemo((): CSSProperties | undefined => {
    if (!anchor) return undefined;
    const maxW = Math.min(window.innerWidth * 0.58, 280);
    return {
      position: 'fixed',
      left: anchor.screenX,
      top: anchor.screenY,
      right: 'auto',
      bottom: 'auto',
      width: maxW,
      transform: anchor.bubbleOnRight
        ? 'translate(12px, -50%)'
        : 'translate(calc(-100% - 12px), -50%)',
      opacity: show ? anchor.opacity : 0,
      visibility: show ? 'visible' : 'hidden',
      pointerEvents: show ? 'auto' : 'none',
    };
  }, [anchor, show]);

  const wrapClass = [
    'speech-bubble-wrap',
    'fade-in',
    anchor ? 'speech-bubble-wrap--anchored' : '',
    anchor?.bubbleOnRight ? 'speech-bubble-wrap--beside-right' : 'speech-bubble-wrap--beside-left',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={wrapClass} style={wrapStyle}>
      <div className="speech-bubble">
        <div className="bubble-header">
          <div className="bubble-landmark">{landmarkName}</div>
          {canSpeak && (
            <button
              type="button"
              className="play-voice-btn"
              onClick={onPlayVoice}
              aria-label="Play voice"
            >
              {playVoiceLabel}
            </button>
          )}
        </div>
        <div className="bubble-text">
          {displayed}
          {isTyping && <span className="bubble-cursor" />}
        </div>
      </div>
    </div>
  );
});

export default SpeechBubble;
