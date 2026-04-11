import { useRef } from "react";

export function useTimeline(audio: HTMLAudioElement | null) {
  const events = useRef<
    { time: number; triggered: boolean; action: () => void }[]
  >([]);

  const lastTime = useRef(0);

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
    const last = lastTime.current;

    // 🔥 IMPORTANT: only trigger when crossing forward
    events.current.forEach((event) => {
      if (
        last < event.time &&
        t >= event.time &&
        !event.triggered
      ) {
        event.triggered = true;
        event.action();
      }
    });

    lastTime.current = t;

    // reset si restart audio
    if (t < last) {
      events.current.forEach((e) => (e.triggered = false));
    }
  };

  const seek = (time: number) => {
    lastTime.current = time;

    events.current.forEach((event) => {
      event.triggered = time >= event.time;
    });
  };

  return { addEvent, update, seek };
}