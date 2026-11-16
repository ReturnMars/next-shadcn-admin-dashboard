import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio Admin",
  url: window.location.origin,
  repository: "https://github.com/ReturnMars/next-shadcn-admin-dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio Admin.`,
  meta: {
    title: "Studio Admin: Open Source shadcn/ui Admin Dashboard",
    description: "MIT-licensed admin dashboard built with React, Vite, TanStack Router and shadcn/ui.",
  },
};
