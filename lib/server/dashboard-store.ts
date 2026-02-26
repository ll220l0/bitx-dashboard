import fs from "node:fs";
import path from "node:path";
import { seedProducts, seedSettings, seedUsers } from "@/lib/seed-data";
import type {
  DashboardSettings,
  NewProductPayload,
  NewUserPayload,
  ProductRecord,
  UserRecord,
} from "@/lib/types";

interface DashboardData {
  users: UserRecord[];
  products: ProductRecord[];
  settings: DashboardSettings;
}

const STORE_FILE = process.env.DASHBOARD_DATA_FILE || path.join(process.cwd(), ".data", "dashboard.json");

function getDefaultData(): DashboardData {
  return {
    users: [...seedUsers],
    products: [...seedProducts],
    settings: { ...seedSettings },
  };
}

function sanitizeSettings(value: unknown): DashboardSettings {
  const candidate = value && typeof value === "object" ? (value as Partial<DashboardSettings>) : {};
  return {
    firstName: typeof candidate.firstName === "string" ? candidate.firstName : seedSettings.firstName,
    lastName: typeof candidate.lastName === "string" ? candidate.lastName : seedSettings.lastName,
    email: typeof candidate.email === "string" ? candidate.email : seedSettings.email,
    phone: typeof candidate.phone === "string" ? candidate.phone : seedSettings.phone,
    company: typeof candidate.company === "string" ? candidate.company : seedSettings.company,
    emailNotifications:
      typeof candidate.emailNotifications === "boolean"
        ? candidate.emailNotifications
        : seedSettings.emailNotifications,
    pushNotifications:
      typeof candidate.pushNotifications === "boolean"
        ? candidate.pushNotifications
        : seedSettings.pushNotifications,
    weeklyDigest:
      typeof candidate.weeklyDigest === "boolean" ? candidate.weeklyDigest : seedSettings.weeklyDigest,
    language:
      candidate.language === "ru" || candidate.language === "en" || candidate.language === "ky"
        ? candidate.language
        : seedSettings.language,
    currency:
      candidate.currency === "USD" ||
      candidate.currency === "KGS" ||
      candidate.currency === "RUB" ||
      candidate.currency === "KZT"
        ? candidate.currency
        : seedSettings.currency,
    theme:
      candidate.theme === "light" || candidate.theme === "dark" || candidate.theme === "system"
        ? candidate.theme
        : seedSettings.theme,
  };
}

function ensureStore(): void {
  const storeDir = path.dirname(STORE_FILE);
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(getDefaultData(), null, 2), "utf8");
  }
}

function readStore(): DashboardData {
  ensureStore();

  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DashboardData>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [...seedUsers],
      products: Array.isArray(parsed.products) ? parsed.products : [...seedProducts],
      settings: sanitizeSettings(parsed.settings),
    };
  } catch {
    return getDefaultData();
  }
}

function writeStore(data: DashboardData): void {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getUsers(): UserRecord[] {
  return readStore().users;
}

export function addUser(payload: NewUserPayload): UserRecord {
  const data = readStore();
  const nextId = data.users.length > 0 ? Math.max(...data.users.map((user) => user.id)) + 1 : 1;
  const dateCreated = new Date().toISOString().slice(0, 10);

  const user: UserRecord = {
    id: nextId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    plan: payload.plan,
    avatar: payload.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.email)}`,
    dateCreated,
  };

  data.users = [user, ...data.users];
  writeStore(data);
  return user;
}

export function getProducts(): ProductRecord[] {
  return readStore().products;
}

export function addProduct(payload: NewProductPayload): ProductRecord {
  const data = readStore();
  const nextId =
    data.products.length > 0 ? Math.max(...data.products.map((product) => product.id)) + 1 : 1;
  const product: ProductRecord = {
    id: nextId,
    image:
      payload.image ||
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop",
    name: payload.name.trim(),
    category: payload.category.trim(),
    price: payload.price,
    stock: payload.stock,
    status: payload.status,
    sku: payload.sku.trim(),
  };

  data.products = [product, ...data.products];
  writeStore(data);
  return product;
}

export function getSettings(): DashboardSettings {
  return readStore().settings;
}

export function saveSettings(nextSettings: DashboardSettings): DashboardSettings {
  const data = readStore();
  data.settings = sanitizeSettings(nextSettings);
  writeStore(data);
  return data.settings;
}

export function resetStoreForTests(): void {
  writeStore(getDefaultData());
}
