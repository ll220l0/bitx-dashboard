"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "./button";

const emptySubscribe = () => () => {};

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.classList.toggle("dark", initialTheme === "dark");
  return initialTheme;
}

export function ThemeToggle() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!isHydrated) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <SunIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <SunIcon className="h-5 w-5 transition-all" />
      ) : (
        <MoonIcon className="h-5 w-5 transition-all" />
      )}
    </Button>
  );
}

