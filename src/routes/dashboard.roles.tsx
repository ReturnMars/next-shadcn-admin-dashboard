import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/roles/page";

export const Route = createFileRoute("/dashboard/roles")({
  head: () => ({
    meta: [
      { title: "Open Source Roles and Permissions UI with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source roles and permissions interface for reviewing access levels and managing roles.",
      },
    ],
  }),
  component: Page,
});
