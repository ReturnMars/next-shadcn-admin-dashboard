import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/academy/page";

export const Route = createFileRoute("/dashboard/academy")({
  head: () => ({
    meta: [
      { title: "Open Source Education Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source education dashboard with class schedules, assignments, performance insights, and upcoming events.",
      },
    ],
  }),
  component: Page,
});
