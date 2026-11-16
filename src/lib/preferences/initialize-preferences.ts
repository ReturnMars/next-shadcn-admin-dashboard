import { getClientCookie } from "@/lib/cookie.client";
import { getLocalStorageValue } from "@/lib/local-storage.client";

import { applyPreference } from "./preference-runtime";
import {
  PREFERENCE_DEFAULTS,
  PREFERENCE_KEYS,
  PREFERENCE_REGISTRY,
  type PreferenceKey,
  parsePreference,
} from "./preferences-config";

/** Apply validated browser preferences before React's first render. */
export function initializePreferences() {
  const values = { ...PREFERENCE_DEFAULTS };
  function initialize<K extends PreferenceKey>(key: K) {
    const { persistence } = PREFERENCE_REGISTRY[key];
    const rawValue = persistence === "client-cookie" ? getClientCookie(key) : getLocalStorageValue(key);
    values[key] = parsePreference(key, rawValue);
    applyPreference(key, values[key]);
  }
  for (const key of PREFERENCE_KEYS) initialize(key);
  return values;
}
