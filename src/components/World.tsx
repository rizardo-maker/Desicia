import { useEffect, useRef, useState } from "react";
import type { Engine } from "../engine/lattice";
import { route } from "../engine/route";

export function LatticeFallback() {
  const points = [];
  for (let x = 0; x < 7; x++)
    for (let y = 0; y < 7; y++) {
      const px = 340 + (x - y) * 27,
        py = 165 + (x + y) * 14;
      points.push(
        <g key={`${x}-${y}`}>
          <path d={`M${px} ${py}v-105m0 0 27-14m-27 14-27-14`} />
          <rect
            x={px - 2}
            y={py - 107}
            width="4"
            height="4"
            fill="currentColor"
          />
          <rect
            x={px - 2}
            y={py - 2}
            width="4"
            height="4"
            fill="currentColor"
          />
        </g>,
      );
    }
  return (
    <svg className="lattice-fallback" viewBox="0 0 680 500" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth=".7" opacity=".7">
        {points}
        <path d="m178 145 162-84 162 84v180l-162 84-162-84Z" />
      </g>
    </svg>
  );
}
export function World({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    route.paused = paused;
    dispatchEvent(new Event("desicia-motion"));
  }, [paused]);
  useEffect(() => {
    const query = matchMedia(
      "(min-width: 701px) and (prefers-reduced-motion: no-preference)",
    );
    let engine: Engine | undefined,
      cancelled = false;
    const setup = async () => {
      engine?.dispose();
      engine = undefined;
      setReady(false);
      if (!query.matches || new URLSearchParams(location.search).has("nogl"))
        return;
      try {
        const { createLattice } = await import("../engine/lattice");
        if (cancelled || !query.matches || !ref.current) return;
        engine = createLattice(ref.current, () => setReady(true));
      } catch {
        setReady(false);
      }
    };
    const lost = () => setReady(false);
    const slow = () => {
      setReady(false);
      engine?.dispose();
      engine = undefined;
    };
    ref.current?.addEventListener("webglcontextlost", lost);
    ref.current?.addEventListener("desicia-low-performance", slow);
    void setup();
    query.addEventListener("change", setup);
    const canvas = ref.current;
    return () => {
      cancelled = true;
      engine?.dispose();
      query.removeEventListener("change", setup);
      canvas?.removeEventListener("webglcontextlost", lost);
      canvas?.removeEventListener("desicia-low-performance", slow);
    };
  }, []);
  return (
    <div className={`world ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <LatticeFallback />
      <canvas ref={ref} />
      <div className="world-vignette" />
    </div>
  );
}
