import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseMailLayout } from "@/features/mail/_components/mail-layout-config";
import { createPreferencesStore } from "@/stores/preferences/preferences-store";

import { deleteClientCookie, setClientCookie } from "./cookie.client";
import { initializePreferences } from "./preferences/initialize-preferences";
import { parsePreference } from "./preferences/preferences-config";
import { applyThemeMode } from "./preferences/theme-utils";
import { fileManagerSearch, kanbanSearch } from "./search-params";

beforeEach(() => {
  for (const cookie of document.cookie.split(";")) {
    deleteClientCookie(cookie.split("=")[0].trim());
  }
  document.documentElement.className = "";
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
  vi.stubGlobal("requestAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("URL state validation", () => {
  it("accepts file list deep links", () => {
    expect(fileManagerSearch.parse({ view: "list" })).toEqual({ view: "list" });
  });
  it("uses the grid default for malformed file view parameters", () => {
    expect(fileManagerSearch.parse({ view: ["list"] })).toEqual({ view: "grid" });
  });
  it.each(["board", "list", "table"])("accepts the %s kanban view", (view) => {
    expect(kanbanSearch.parse({ view })).toEqual({ view });
  });
  it("uses the board default for unknown views and allows an absent parameter", () => {
    expect(kanbanSearch.parse({ view: "unknown" })).toEqual({ view: "board" });
    expect(kanbanSearch.parse({})).toEqual({});
  });
});

describe("browser preferences after removing server rendering", () => {
  it("restores theme, font and sidebar choices before rendering", () => {
    setClientCookie("theme_mode", "dark");
    setClientCookie("font", "inter");
    setClientCookie("sidebar_variant", "inset");
    const values = initializePreferences();
    expect(values.theme_mode).toBe("dark");
    expect(values.sidebar_variant).toBe("inset");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.font).toBe("inter");
  });
  it("validates stale cookie values against the preference registry", () => {
    expect(parsePreference("sidebar_variant", "invalid")).toBe("sidebar");
    expect(parsePreference("font", "missing-font")).toBe("geist");
  });
  it("resolves the system theme without a Next theme provider", () => {
    expect(applyThemeMode("system")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
  it("persists preference changes and resets across boot", () => {
    const store = createPreferencesStore();
    store.getState().setPreference("theme_mode", "dark");
    store.getState().setPreference("navbar_style", "scroll");
    expect(initializePreferences().navbar_style).toBe("scroll");
    store.getState().resetPreferences();
    expect(initializePreferences().theme_mode).toBe("light");
    expect(initializePreferences().navbar_style).toBe("sticky");
  });
  it("ignores the retired centered-layout cookie on boot and preference reset", () => {
    setClientCookie("content_layout", "centered");
    const values = initializePreferences();
    expect(values).not.toHaveProperty("content_layout");
    expect(document.documentElement.dataset.contentLayout).toBeUndefined();
    const store = createPreferencesStore(values);
    store.getState().resetPreferences();
    expect(initializePreferences()).not.toHaveProperty("content_layout");
    expect(document.documentElement.dataset.contentLayout).toBeUndefined();
  });
});

describe("saved mail panels", () => {
  it("preserves a valid saved split", () => {
    expect(parseMailLayout("[45,55]")).toEqual([45, 55]);
  });
  it("defaults only when there is no preference or it is corrupt", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(parseMailLayout(undefined)).toEqual([38, 62]);
    expect(warning).not.toHaveBeenCalled();
    expect(parseMailLayout("not-json")).toEqual([38, 62]);
    expect(parseMailLayout("[999,1]")).toEqual([38, 62]);
    expect(warning).toHaveBeenCalledTimes(2);
  });
});
