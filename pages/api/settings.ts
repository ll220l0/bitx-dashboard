import type { NextApiRequest, NextApiResponse } from "next";
import { getSettings, saveSettings } from "@/lib/server/dashboard-store";
import type { DashboardSettings } from "@/lib/types";

function isValidTheme(theme: string): theme is DashboardSettings["theme"] {
  return theme === "light" || theme === "dark" || theme === "system";
}

function isDashboardSettings(value: unknown): value is DashboardSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DashboardSettings>;
  return (
    typeof candidate.firstName === "string" &&
    typeof candidate.lastName === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.company === "string" &&
    typeof candidate.emailNotifications === "boolean" &&
    typeof candidate.pushNotifications === "boolean" &&
    typeof candidate.weeklyDigest === "boolean" &&
    typeof candidate.language === "string" &&
    typeof candidate.timezone === "string" &&
    typeof candidate.currency === "string" &&
    typeof candidate.theme === "string" &&
    isValidTheme(candidate.theme)
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ settings: getSettings() });
  }

  if (req.method === "PUT") {
    if (!isDashboardSettings(req.body)) {
      return res.status(400).json({ error: "Invalid settings payload." });
    }
    const settings = saveSettings(req.body);
    return res.status(200).json({ settings });
  }

  res.setHeader("Allow", "GET,PUT");
  return res.status(405).json({ error: "Method not allowed." });
}

