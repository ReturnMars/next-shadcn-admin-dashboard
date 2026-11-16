import { StrictMode } from "react";

import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { initializePreferences } from "@/lib/preferences/initialize-preferences";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import { router } from "./router";
import "./styles/fonts.css";
import "./app/globals.css";

const preferences = initializePreferences();
const root = document.getElementById("root");
if (!root) throw new Error("Application root is missing.");

createRoot(root).render(
  <StrictMode>
    <PreferencesStoreProvider initialValues={preferences}>
      <RouterProvider router={router} />
    </PreferencesStoreProvider>
  </StrictMode>,
);
