"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  GlobeIcon,
  PaletteIcon,
  SaveIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { DashboardSettings } from "@/lib/types";
import { t } from "@/lib/i18n";

const allowedLanguages = new Set<DashboardSettings["language"]>(["ru", "en", "ky"]);
const allowedCurrencies = new Set<DashboardSettings["currency"]>(["USD", "KGS", "RUB", "KZT"]);

const DEFAULT_SETTINGS: DashboardSettings = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  company: "Company Inc.",
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  language: "en",
  currency: "USD",
  theme: "system",
};

function normalizeSettings(settings: DashboardSettings): DashboardSettings {
  return {
    ...settings,
    language: allowedLanguages.has(settings.language) ? settings.language : DEFAULT_SETTINGS.language,
    currency: allowedCurrencies.has(settings.currency) ? settings.currency : DEFAULT_SETTINGS.currency,
  };
}

function getInitialSettings(): DashboardSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const merged = { ...DEFAULT_SETTINGS };
  const savedSettings = localStorage.getItem("dashboardSettings");
  if (savedSettings) {
    try {
      Object.assign(merged, JSON.parse(savedSettings));
    } catch {
      // Ignore invalid local storage payloads.
    }
  }

  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  const savedThemeMode = localStorage.getItem("themeMode") as "light" | "dark" | "system" | null;
  if (savedThemeMode) {
    merged.theme = savedThemeMode;
  } else if (savedTheme) {
    merged.theme = savedTheme;
  }

  return normalizeSettings(merged);
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const tx = (key: string, params?: Record<string, number | string>) => t(formData.language, key, params);

  useEffect(() => {
    let active = true;
    const initial = getInitialSettings();
    const initialLanguage = initial.language;
    setFormData(initial);
    applyTheme(initial.theme);

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to load settings.");
        }

        const data = (await response.json()) as { settings: DashboardSettings };
        if (active) {
          const normalized = normalizeSettings(data.settings);
          setFormData(normalized);
          applyTheme(normalized.theme);
          localStorage.setItem("dashboardSettings", JSON.stringify(normalized));
          setRequestError(null);
        }
      } catch {
        if (active) {
          setRequestError(t(initialLanguage, "settings.loadError"));
        }
      }
    };

    void loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const applyTheme = (themeMode: string) => {
    if (themeMode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.removeItem("theme");
      localStorage.setItem("themeMode", "system");
      return;
    }

    document.documentElement.classList.toggle("dark", themeMode === "dark");
    localStorage.setItem("theme", themeMode);
    localStorage.setItem("themeMode", themeMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const next = {
      ...formData,
      [name]: value,
    } as DashboardSettings;
    setFormData(next);

    if (name === "theme") {
      applyTheme(value);
    }

    if (name === "language" || name === "currency" || name === "theme") {
      localStorage.setItem("dashboardSettings", JSON.stringify(next));
      window.dispatchEvent(new Event("dashboard-settings-updated"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings.");
      }

      const data = (await response.json()) as { settings: DashboardSettings };
      const normalized = normalizeSettings(data.settings);
      setFormData(normalized);
      localStorage.setItem("dashboardSettings", JSON.stringify(normalized));
      window.dispatchEvent(new Event("dashboard-settings-updated"));
      setRequestError(null);
      setSaveNotice(tx("settings.saved"));
      window.setTimeout(() => setSaveNotice(null), 2400);
    } catch {
      setRequestError(tx("settings.saveError"));
      setSaveNotice(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full sticky top-0 z-50 bg-white dark:bg-neutral-950 flex-shrink-0 flex flex-row h-16 items-center px-8 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-lg font-bold">{tx("settings.title")}</h1>
        <div className="ml-auto flex gap-2">
          <Button type="submit" form="settings-form" disabled={isSaving}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSaving ? tx("settings.saving") : tx("settings.saveChanges")}
          </Button>
        </div>
        {saveNotice && <p className="ml-4 text-xs text-green-600">{saveNotice}</p>}
        {requestError && <p className="ml-4 text-xs text-red-500">{requestError}</p>}
      </div>

      <div className="max-w-4xl w-full mx-auto flex-1 p-8">
        <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-transparent p-0 overflow-hidden">
            <div className="bg-card p-4 border-none flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{tx("settings.profileInformation")}</h2>
                <p className="text-xs text-muted-foreground">{tx("settings.updatePersonalDetails")}</p>
              </div>
            </div>
            <div className="space-y-4 px-4 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    {tx("settings.firstName")}
                  </label>
                  <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    {tx("settings.lastName")}
                  </label>
                  <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {tx("settings.email")}
                </label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    {tx("settings.phone")}
                  </label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {tx("settings.company")}
                  </label>
                  <Input id="company" name="company" type="text" value={formData.company} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-transparent p-0 overflow-hidden">
            <div className="bg-card p-4 border-none flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <ShieldIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{tx("settings.security")}</h2>
                <p className="text-xs text-muted-foreground">{tx("settings.managePasswordSecurity")}</p>
              </div>
            </div>
            <div className="px-4 pb-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{tx("settings.password")}</p>
                  <p className="text-sm text-muted-foreground">{tx("settings.lastChanged3Months")}</p>
                </div>
                <Button variant="outline" size="sm">
                  {tx("settings.changePassword")}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-transparent p-0 overflow-hidden">
            <div className="bg-card p-4 border-none flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <BellIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{tx("settings.notifications")}</h2>
                <p className="text-xs text-muted-foreground">{tx("settings.chooseNotifications")}</p>
              </div>
            </div>
            <div className="space-y-4 px-4 pb-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{tx("settings.emailNotifications")}</p>
                  <p className="text-sm text-muted-foreground">{tx("settings.receiveEmailUpdates")}</p>
                </div>
                <Switch checked={formData.emailNotifications} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emailNotifications: checked }))} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{tx("settings.pushNotifications")}</p>
                  <p className="text-sm text-muted-foreground">{tx("settings.receivePushNotifications")}</p>
                </div>
                <Switch checked={formData.pushNotifications} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, pushNotifications: checked }))} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{tx("settings.weeklyDigest")}</p>
                  <p className="text-sm text-muted-foreground">{tx("settings.getWeeklySummary")}</p>
                </div>
                <Switch checked={formData.weeklyDigest} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, weeklyDigest: checked }))} />
              </div>
            </div>
          </Card>

          <Card className="bg-transparent p-0 overflow-hidden">
            <div className="bg-card p-4 border-none flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <GlobeIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{tx("settings.preferences")}</h2>
                <p className="text-xs text-muted-foreground">{tx("settings.customizeExperience")}</p>
              </div>
            </div>
            <div className="space-y-4 px-4 pb-6 pt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-2">
                  {tx("settings.language")}
                </label>
                <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ky">Кыргызча</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium mb-2">
                  {tx("settings.currency")}
                </label>
                <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{tx("settings.currencyUSD")}</SelectItem>
                    <SelectItem value="KGS">{tx("settings.currencyKGS")}</SelectItem>
                    <SelectItem value="RUB">{tx("settings.currencyRUB")}</SelectItem>
                    <SelectItem value="KZT">{tx("settings.currencyKZT")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="bg-transparent p-0 overflow-hidden">
            <div className="bg-card p-4 border-none flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <PaletteIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{tx("settings.appearance")}</h2>
                <p className="text-xs text-muted-foreground">{tx("settings.customizeLooks")}</p>
              </div>
            </div>
            <div className="px-4 pb-6">
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectChange("theme", "light")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="w-full h-16 bg-white border border-neutral-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">{tx("settings.light")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectChange("theme", "dark")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="w-full h-16 bg-neutral-900 border border-neutral-800 rounded mb-2"></div>
                  <p className="text-sm font-medium">{tx("settings.dark")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectChange("theme", "system")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.theme === "system"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-r from-white via-neutral-400 to-neutral-900 border border-neutral-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">{tx("settings.system")}</p>
                </button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  );
}

