import { useRef } from "react";

export function useTimeline(audio: HTMLAudioElement | null) {
  const events = useRef<
    { time: number; triggered: boolean; action: () => void }[]
  >([]);

  const addEvent = (time: number, action: () => void) => {
    events.current.push({
      time,
      triggered: false,
      action,
    });
  };

  const update = () => {
    if (!audio) return;

    const t = audio.currentTime;

    events.current.forEach((event) => {
      if (t >= event.time && !event.triggered) {
        event.triggered = true;
        event.action();
      }
    });

    // reset si replay
    if (t < 0.5) {
      events.current.forEach((e) => (e.triggered = false));
    }
  };

  return { addEvent, update };
}