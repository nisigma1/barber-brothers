"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type TiltStyle = CSSProperties & {
  "--tilt-rotate-x"?: string;
  "--tilt-rotate-y"?: string;
  "--tilt-scale"?: string;
};

interface TiltProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  rotationFactor?: number;
  isReverse?: boolean;
  isRevese?: boolean;
}

export function Tilt({
  children,
  className,
  innerClassName,
  rotationFactor = 6,
  isReverse = false,
  isRevese = false,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<TiltStyle>({
    "--tilt-rotate-x": "0deg",
    "--tilt-rotate-y": "0deg",
    "--tilt-scale": "1",
  });
  const [enabled, setEnabled] = useState(false);
  const reverse = isReverse || isRevese;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    function updateEnabled() {
      setEnabled(!reducedMotion.matches && finePointer.matches);
    }

    updateEnabled();
    reducedMotion.addEventListener("change", updateEnabled);
    finePointer.addEventListener("change", updateEnabled);

    return () => {
      reducedMotion.removeEventListener("change", updateEnabled);
      finePointer.removeEventListener("change", updateEnabled);
    };
  }, []);

  function resetTilt() {
    setStyle({
      "--tilt-rotate-x": "0deg",
      "--tilt-rotate-y": "0deg",
      "--tilt-scale": "1",
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const direction = reverse ? -1 : 1;

    setStyle({
      "--tilt-rotate-x": `${-y * rotationFactor * direction}deg`,
      "--tilt-rotate-y": `${x * rotationFactor * direction}deg`,
      "--tilt-scale": "1.015",
    });
  }

  return (
    <div
      ref={ref}
      className={`tilt-root ${className ?? ""}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={style}
    >
      <div className={`tilt-inner ${innerClassName ?? ""}`.trim()}>{children}</div>
    </div>
  );
}
