import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/profile/page";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Open Source Employee Profile Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source employee profile dashboard with personal details, employment information, time off, documents, and reporting lines.",
      },
    ],
  }),
  component: Page,
});
