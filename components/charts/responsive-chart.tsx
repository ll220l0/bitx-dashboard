"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { ResponsiveContainer } from "recharts";

const emptySubscribe = () => () => {};

interface ResponsiveChartProps {
  children: ReactNode;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  minWidth?: number | `${number}%`;
  minHeight?: number | `${number}%`;
  aspect?: number;
  debounce?: number;
}

export function ResponsiveChart({
  children,
  width = "100%",
  height = "100%",
  minWidth = 0,
  minHeight,
  aspect,
  debounce,
}: ResponsiveChartProps) {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isHydrated) {
    return <div className="h-full w-full" />;
  }

  return (
    <ResponsiveContainer
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      aspect={aspect}
      debounce={debounce}
    >
      {children}
    </ResponsiveContainer>
  );
}
