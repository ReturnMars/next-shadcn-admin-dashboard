import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/users/page";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({
    meta: [
      { title: "Open Source User Management Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source user management dashboard for browsing, filtering, and managing user accounts.",
      },
    ],
  }),
  component: Page,
});
