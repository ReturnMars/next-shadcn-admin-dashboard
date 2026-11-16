import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/productivity/page";

export const Route = createFileRoute("/dashboard/productivity")({
  head: () => ({
    meta: [
      { title: "Open Source Productivity Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source productivity dashboard with tasks, projects, focus time, notes, schedules, and weekly progress.",
      },
    ],
  }),
  component: Page,
});
