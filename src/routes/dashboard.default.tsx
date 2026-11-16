import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/default/page";

export const Route = createFileRoute("/dashboard/default")({
  head: () => ({
    meta: [
      { title: "Open Source Business Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source admin dashboard with business metrics, customer activity, performance charts, and customer data.",
      },
    ],
  }),
  component: Page,
});
