import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/auth/v1/login/page";

export const Route = createFileRoute("/auth/v1/login")({
  head: () => ({
    meta: [
      { title: "Open Source Split Screen Login Page with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source split screen login page with email and password fields, social sign-in, and a registration link.",
      },
    ],
  }),
  component: Page,
});
