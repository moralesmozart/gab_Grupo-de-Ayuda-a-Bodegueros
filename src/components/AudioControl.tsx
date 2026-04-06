import { useCallback, useId, useRef, useState } from "react";

type Props = {
  label: string;
  src?: string;
};

export default function AudioControl({ label, src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const labelId = useId();

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [src]);

  return (
    <div className="audio-control">
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          aria-labelledby={labelId}
        />
      ) : null}
      <button
        type="button"
        className={`audio-control__btn${!src ? " audio-control__btn--soon" : ""}`}
        onClick={toggle}
        disabled={!src}
        aria-label={src ? (playing ? "Pausar audio" : "Escuchar historia") : "Audio disponible pronto"}
        title={src ? undefined : "Próximamente: historia en voz de Eva"}
      >
        <span className="audio-control__icon" aria-hidden>
          {playing ? "❚❚" : "▶"}
        </span>
      </button>
      <span id={labelId} className="audio-control__text">
        {label}
      </span>
    </div>
  );
}
