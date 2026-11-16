import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/invoice/page";

export const Route = createFileRoute("/dashboard/invoice")({
  head: () => ({
    meta: [
      { title: "Open Source Invoice Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source invoice dashboard for creating, reviewing, saving, and sending customer invoices.",
      },
    ],
  }),
  component: Page,
});
