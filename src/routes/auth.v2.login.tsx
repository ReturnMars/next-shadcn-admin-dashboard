import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/auth/v2/login/page";

export const Route = createFileRoute("/auth/v2/login")({
  head: () => ({
    meta: [
      { title: "Open Source Branded Login Page with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source branded login page with a two-column layout, social sign-in, and email and password fields.",
      },
    ],
  }),
  component: Page,
});
