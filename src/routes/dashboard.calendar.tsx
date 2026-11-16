import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/calendar/page";

export const Route = createFileRoute("/dashboard/calendar")({
  head: () => ({
    meta: [
      { title: "Open Source Calendar with shadcn/ui" },
      {
        name: "description",
        content: "Explore an open source calendar interface for organizing events, schedules, and daily activities.",
      },
    ],
  }),
  component: Page,
});
