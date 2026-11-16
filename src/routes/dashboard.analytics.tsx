import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/analytics/page";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Open Source Analytics Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source analytics dashboard with traffic metrics, realtime visitors, page performance, and conversion insights.",
      },
    ],
  }),
  component: Page,
});
