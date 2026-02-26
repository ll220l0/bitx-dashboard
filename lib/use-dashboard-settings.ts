"use client";

import { useEffect, useMemo, useState } from "react";
import { seedSettings } from "@/lib/seed-data";
import type { DashboardSettings } from "@/lib/types";

const LANG_TO_LOCALE: Record<DashboardSettings["language"], string> = {
  ru: "ru-RU",
  en: "en-US",
  ky: "ky-KG",
};

const allowedLanguages = new Set<DashboardSettings["language"]>(["ru", "en", "ky"]);
const allowedCurrencies = new Set<DashboardSettings["currency"]>(["USD", "KGS", "RUB", "KZT"]);

function normalizeSettings(settings: DashboardSettings): DashboardSettings {
  return {
    ...seedSettings,
    ...settings,
    language: allowedLanguages.has(settings.language) ? settings.language : seedSettings.language,
    currency: allowedCurrencies.has(settings.currency) ? settings.currency : seedSettings.currency,
    theme: settings.theme ?? seedSettings.theme,
  };
}

function readLocalSettings(): DashboardSettings {
  if (typeof window === "undefined") {
    return seedSettings;
  }

  const raw = localStorage.getItem("dashboardSettings");
  if (!raw) {
    return seedSettings;
  }

  try {
    const parsed = JSON.parse(raw) as DashboardSettings;
    return normalizeSettings(parsed);
  } catch {
    return seedSettings;
  }
}

export function useDashboardSettings() {
  const [settings, setSettings] = useState<DashboardSettings>(seedSettings);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const localFallback = readLocalSettings();

      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          if (active) {
            setSettings(localFallback);
          }
          return;
        }

        const data = (await response.json()) as { settings: DashboardSettings };
        if (!active) {
          return;
        }

        const next = normalizeSettings(data.settings);
        setSettings(next);
        localStorage.setItem("dashboardSettings", JSON.stringify(next));
      } catch {
        if (active) {
          setSettings(localFallback);
        }
      }
    };

    const handleExternalUpdate = () => {
      setSettings(readLocalSettings());
    };

    void load();
    window.addEventListener("storage", handleExternalUpdate);
    window.addEventListener("dashboard-settings-updated", handleExternalUpdate);

    return () => {
      active = false;
      window.removeEventListener("storage", handleExternalUpdate);
      window.removeEventListener("dashboard-settings-updated", handleExternalUpdate);
    };
  }, []);

  const locale = LANG_TO_LOCALE[settings.language];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: settings.currency,
      }),
    [locale, settings.currency],
  );

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const formatCurrency = (value: number) => currencyFormatter.format(value);
  const formatNumber = (value: number) => numberFormatter.format(value);
  const formatDate = (
    value: string | Date,
    options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
  ) => {
    const dateValue =
      typeof value === "string"
        ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value)
        : value;
    const formatOptions = options.timeZone ? options : { ...options, timeZone: "UTC" };
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateValue);
  };

  return {
    settings,
    locale,
    formatCurrency,
    formatNumber,
    formatDate,
  };
}
