"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
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
