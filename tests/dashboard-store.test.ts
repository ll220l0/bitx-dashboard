import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { before, test } from "node:test";
import type { DashboardSettings } from "../lib/types";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dashboard-store-"));
process.env.DASHBOARD_DATA_FILE = path.join(tempDir, "dashboard.json");

let store: typeof import("../lib/server/dashboard-store");

before(async () => {
  store = await import("../lib/server/dashboard-store");
});

test("loads default users and products when store is empty", () => {
  store.resetStoreForTests();
  assert.ok(store.getUsers().length > 0);
  assert.ok(store.getProducts().length > 0);
});

test("adds a user and persists it", () => {
  store.resetStoreForTests();
  const before = store.getUsers().length;
  const created = store.addUser({
    name: "Test User",
    email: "test.user@example.com",
    plan: "Pro",
  });
  const after = store.getUsers().length;

  assert.equal(after, before + 1);
  assert.equal(created.email, "test.user@example.com");
});

test("adds a product and persists it", () => {
  store.resetStoreForTests();
  const before = store.getProducts().length;
  const created = store.addProduct({
    name: "Smoke Product",
    category: "Electronics",
    price: 42.5,
    stock: 5,
    status: "In Stock",
    sku: "SMOKE-001",
  });
  const after = store.getProducts().length;

  assert.equal(after, before + 1);
  assert.equal(created.sku, "SMOKE-001");
});

test("saves and reads settings", () => {
  store.resetStoreForTests();
  const settings = store.getSettings();
  const updated: DashboardSettings = {
    ...settings,
    firstName: "Jane",
    weeklyDigest: false,
  };

  store.saveSettings(updated);
  const persisted = store.getSettings();
  assert.equal(persisted.firstName, "Jane");
  assert.equal(persisted.weeklyDigest, false);
});
