import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/auth/v1/register/page";

export const Route = createFileRoute("/auth/v1/register")({
  head: () => ({
    meta: [
      { title: "Open Source Split Screen Registration Page with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source split screen registration page with account details, social sign-up, and a login link.",
      },
    ],
  }),
  component: Page,
});
