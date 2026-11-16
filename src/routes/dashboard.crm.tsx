import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/crm/page";

export const Route = createFileRoute("/dashboard/crm")({
  head: () => ({
    meta: [
      { title: "Open Source CRM Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source CRM dashboard with pipeline activity, opportunities, sales performance, and task reminders.",
      },
    ],
  }),
  component: Page,
});
