import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/tasks/page";

export const Route = createFileRoute("/dashboard/tasks")({
  head: () => ({
    meta: [
      { title: "Open Source Task Manager with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source task manager for searching, filtering, organizing, and tracking work in one place.",
      },
    ],
  }),
  component: Page,
});
