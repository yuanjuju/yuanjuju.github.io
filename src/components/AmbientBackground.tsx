"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./AmbientBackground.module.css";

// Deterministic positions keep the exported HTML and hydration identical.
const stars = Array.from({ length: 56 }, (_, index) => {
  const seed = ((index + 1) * 2654435761) >>> 0;
  return {
    "--x": `${3 + (seed % 940) / 10}%`,
    "--y": `${9 + ((seed >>> 8) % 830) / 10}%`,
    "--size": `${index % 13 === 0 ? 2.6 : index % 3 === 0 ? 1.8 : 1}px`,
    "--duration": `${4.5 + (index % 7) * 0.8}s`,
    "--delay": `${-(index % 11) * 0.7}s`,
  } as CSSProperties;
});

const motes = Array.from({ length: 12 }, (_, index) => ({
  "--x": `${7 + ((index * 37) % 86)}%`,
  "--y": `${22 + ((index * 19) % 69)}%`,
  "--duration": `${12 + (index % 5) * 3}s`,
  "--delay": `${-index * 1.9}s`,
}) as CSSProperties);

const meteors = [
  [76, 10], [102, 25], [39, 12], [108, 56],
  [65, 5], [94, 76], [27, 30], [106, 8],
].map(([x, y], index) => ({
  "--meteor-x": `${x}%`,
  "--meteor-y": `${y}%`,
  "--meteor-index": index,
  "--trail-scale": index % 3 === 0 ? 1 : 0.75,
}) as CSSProperties);

const cloudLayers = [
  styles.cloudLeft, styles.cloudFar, styles.cloudHigh,
  styles.cloudLow, styles.cloudBottom, styles.cloudEdge,
];

export function AmbientBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibility = () => {
      if (backgroundRef.current) {
        backgroundRef.current.dataset.paused = String(document.hidden);
      }
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div ref={backgroundRef} className={styles.background} aria-hidden="true">
      <div className={styles.night}>
        <div className={styles.nebula} />
        <div className={styles.aurora} />
        <div className={`${styles.aurora} ${styles.auroraEcho}`} />
        <div className={styles.stars}>
          {stars.map((style, index) => (
            <span
              key={index}
              className={`${styles.star} ${index % 13 === 0 ? styles.spark : ""}`}
              style={style}
            />
          ))}
        </div>
        <div className={styles.moon}><span /></div>
        <div className={styles.meteors}>
          {meteors.map((style, index) => (
            <span key={index} className={styles.meteor} style={style} />
          ))}
        </div>
      </div>
      <div className={styles.day}>
        <div className={styles.sun}><span /></div>
        <div className={styles.clouds}>
          {cloudLayers.map((layer, index) => (
            <div key={layer} className={`${styles.cloud} ${layer}`}>
              <svg viewBox="0 0 360 140" fill="none" focusable="false">
                <defs>
                  <linearGradient id={`ambient-cloud-${index}`} x1="180" y1="15" x2="180" y2="128" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="0.58" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#dceaf6" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <path
                  d="M28 112C13 112 6 102 9 90C12 77 24 69 39 69C43 49 59 36 79 36C94 36 106 44 113 56C119 28 141 12 167 15C191 18 207 35 211 57C223 44 240 42 255 49C269 55 277 68 278 82C297 72 320 79 326 95C342 95 351 106 341 117C330 131 61 135 28 112Z"
                  fill={`url(#ambient-cloud-${index})`}
                />
              </svg>
            </div>
          ))}
        </div>
        <div className={styles.motes}>
          {motes.map((style, index) => (
            <span key={index} className={styles.mote} style={style} />
          ))}
        </div>
      </div>
    </div>
  );
}
