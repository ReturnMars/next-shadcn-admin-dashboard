import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/infrastructure/page";

export const Route = createFileRoute("/dashboard/infrastructure")({
  head: () => ({
    meta: [
      { title: "Open Source Infrastructure Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source infrastructure dashboard with environments, server health, uptime, resource usage, and deployment status.",
      },
    ],
  }),
  component: Page,
});
