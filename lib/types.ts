export type UserPlan = "Free" | "Pro";

export interface UserRecord {
  id: number;
  avatar: string;
  name: string;
  email: string;
  plan: UserPlan;
  dateCreated: string;
}

export interface NewUserPayload {
  avatar?: string;
  name: string;
  email: string;
  plan: UserPlan;
}

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface ProductRecord {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  sku: string;
}

export interface NewProductPayload {
  image?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  sku: string;
}

export interface DashboardSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  language: string;
  timezone: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

