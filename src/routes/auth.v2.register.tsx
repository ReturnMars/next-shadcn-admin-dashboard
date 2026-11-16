import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/auth/v2/register/page";

export const Route = createFileRoute("/auth/v2/register")({
  head: () => ({
    meta: [
      { title: "Open Source Branded Registration Page with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source branded registration page with a two-column layout, social sign-up, and account details.",
      },
    ],
  }),
  component: Page,
});
