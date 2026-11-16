import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/logistics/page";

export const Route = createFileRoute("/dashboard/logistics")({
  head: () => ({
    meta: [
      { title: "Open Source Logistics Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source logistics dashboard with shipment tracking, delivery status, route maps, cargo details, and transport information.",
      },
    ],
  }),
  component: Page,
});
