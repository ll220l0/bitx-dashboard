"use client";

import { useMemo } from "react";
import { t } from "@/lib/i18n";
import { useDashboardSettings } from "@/lib/use-dashboard-settings";
import type { DashboardLanguage, ProductStatus, UserPlan } from "@/lib/types";

type CampaignType = "push-notification" | "in-app" | "acquisition" | "retargeting";
type CampaignFrequency = "daily" | "weekly" | "bi-weekly" | "monthly";
type CampaignStatus = "active" | "paused" | "draft";

const PRODUCT_CATEGORY_LABELS: Record<string, Record<DashboardLanguage, string>> = {
  Electronics: { en: "Electronics", ru: "Электроника", ky: "Электроника" },
  Footwear: { en: "Footwear", ru: "Обувь", ky: "Бут кийим" },
  Accessories: { en: "Accessories", ru: "Аксессуары", ky: "Аксессуарлар" },
  Bags: { en: "Bags", ru: "Сумки", ky: "Сумкалар" },
  Clothing: { en: "Clothing", ru: "Одежда", ky: "Кийим" },
  "Home & Living": { en: "Home & Living", ru: "Дом и быт", ky: "Үй жана турмуш" },
};

const PRODUCT_STATUS_LABELS: Record<ProductStatus, Record<DashboardLanguage, string>> = {
  "In Stock": { en: "In Stock", ru: "В наличии", ky: "Бар" },
  "Low Stock": { en: "Low Stock", ru: "Мало на складе", ky: "Аз калды" },
  "Out of Stock": { en: "Out of Stock", ru: "Нет в наличии", ky: "Жок" },
};

const USER_PLAN_LABELS: Record<UserPlan, Record<DashboardLanguage, string>> = {
  Free: { en: "Free", ru: "Бесплатный", ky: "Акысыз" },
  Pro: { en: "Pro", ru: "Pro", ky: "Pro" },
};

const CAMPAIGN_TYPE_LABELS: Record<CampaignType, Record<DashboardLanguage, string>> = {
  "push-notification": { en: "Push", ru: "Push", ky: "Push" },
  "in-app": { en: "In-App", ru: "In-App", ky: "In-App" },
  acquisition: { en: "Acquisition", ru: "Привлечение", ky: "Тартуу" },
  retargeting: { en: "Retargeting", ru: "Ретаргетинг", ky: "Ретаргетинг" },
};

const CAMPAIGN_FREQUENCY_LABELS: Record<CampaignFrequency, Record<DashboardLanguage, string>> = {
  daily: { en: "Daily", ru: "Ежедневно", ky: "Күн сайын" },
  weekly: { en: "Weekly", ru: "Еженедельно", ky: "Жума сайын" },
  "bi-weekly": { en: "Bi-Weekly", ru: "Раз в 2 недели", ky: "2 жумада бир" },
  monthly: { en: "Monthly", ru: "Ежемесячно", ky: "Ай сайын" },
};

const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, Record<DashboardLanguage, string>> = {
  active: { en: "Active", ru: "Активна", ky: "Активдүү" },
  paused: { en: "Paused", ru: "Пауза", ky: "Токтотулган" },
  draft: { en: "Draft", ru: "Черновик", ky: "Каралама" },
};

function getRussianPluralForm(count: number): "one" | "few" | "many" {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return "one";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "few";
  }
  return "many";
}

function pluralWord(
  language: DashboardLanguage,
  count: number,
  forms: { en: [string, string]; ru: [string, string, string]; ky: [string, string] },
): string {
  if (language === "ru") {
    const form = getRussianPluralForm(count);
    if (form === "one") {
      return forms.ru[0];
    }
    if (form === "few") {
      return forms.ru[1];
    }
    return forms.ru[2];
  }

  if (language === "ky") {
    return Math.abs(count) === 1 ? forms.ky[0] : forms.ky[1];
  }

  return Math.abs(count) === 1 ? forms.en[0] : forms.en[1];
}

function parseStoreDate(value: string): Date | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function relativeUnitWord(language: DashboardLanguage, unit: "day" | "week", value: number): string {
  if (unit === "day") {
    return pluralWord(language, value, {
      en: ["day", "days"],
      ru: ["день", "дня", "дней"],
      ky: ["күн", "күн"],
    });
  }

  return pluralWord(language, value, {
    en: ["week", "weeks"],
    ru: ["неделя", "недели", "недель"],
    ky: ["жума", "жума"],
  });
}

export function useI18n() {
  const { settings, locale, formatCurrency, formatNumber, formatDate } = useDashboardSettings();

  const tx = useMemo(
    () => (key: string, params?: Record<string, number | string>) => t(settings.language, key, params),
    [settings.language],
  );

  const language = settings.language;

  const countLabel = (entity: "products" | "users" | "proUsers" | "campaigns" | "days", count: number): string => {
    switch (entity) {
      case "products":
        return `${formatNumber(count)} ${pluralWord(language, count, {
          en: ["product", "products"],
          ru: ["товар", "товара", "товаров"],
          ky: ["товар", "товар"],
        })}`;
      case "users":
        return `${formatNumber(count)} ${pluralWord(language, count, {
          en: ["user", "users"],
          ru: ["пользователь", "пользователя", "пользователей"],
          ky: ["колдонуучу", "колдонуучу"],
        })}`;
      case "proUsers":
        return `${formatNumber(count)} Pro ${pluralWord(language, count, {
          en: ["user", "users"],
          ru: ["пользователь", "пользователя", "пользователей"],
          ky: ["колдонуучу", "колдонуучу"],
        })}`;
      case "campaigns":
        return `${formatNumber(count)} ${pluralWord(language, count, {
          en: ["campaign", "campaigns"],
          ru: ["кампания", "кампании", "кампаний"],
          ky: ["кампания", "кампания"],
        })}`;
      case "days":
        return `${formatNumber(count)} ${pluralWord(language, count, {
          en: ["day", "days"],
          ru: ["день", "дня", "дней"],
          ky: ["күн", "күн"],
        })}`;
      default:
        return String(count);
    }
  };

  const productCategoryLabel = (category: string): string => {
    const found = PRODUCT_CATEGORY_LABELS[category];
    return found ? found[language] : category;
  };

  const productStatusLabel = (status: ProductStatus): string => PRODUCT_STATUS_LABELS[status][language];
  const userPlanLabel = (plan: UserPlan): string => USER_PLAN_LABELS[plan][language];
  const campaignTypeLabel = (type: CampaignType): string => CAMPAIGN_TYPE_LABELS[type][language];
  const campaignFrequencyLabel = (frequency?: CampaignFrequency): string =>
    frequency ? CAMPAIGN_FREQUENCY_LABELS[frequency][language] : "-";
  const campaignStatusLabel = (status: CampaignStatus): string => CAMPAIGN_STATUS_LABELS[status][language];

  const formatStoredDate = (value: string): string => {
    const parsed = parseStoreDate(value);
    if (!parsed) {
      return value;
    }
    return formatDate(parsed, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  };

  const relativeTimeLabel = (raw: string): string => {
    const match = raw.match(/^(\d+)\s+(day|days|week|weeks)\s+ago$/i);
    if (!match) {
      return raw;
    }
    const value = Number(match[1]);
    const unit = match[2].startsWith("week") ? "week" : "day";
    if (language === "ru") {
      return `${formatNumber(value)} ${relativeUnitWord(language, unit, value)} назад`;
    }
    if (language === "ky") {
      return `${formatNumber(value)} ${relativeUnitWord(language, unit, value)} мурун`;
    }
    return `${formatNumber(value)} ${relativeUnitWord(language, unit, value)} ago`;
  };

  return {
    settings,
    language,
    locale,
    tx,
    formatCurrency,
    formatNumber,
    formatDate,
    formatStoredDate,
    countLabel,
    productCategoryLabel,
    productStatusLabel,
    userPlanLabel,
    campaignTypeLabel,
    campaignFrequencyLabel,
    campaignStatusLabel,
    relativeTimeLabel,
  };
}
