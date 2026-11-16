import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/kanban/page";
import { kanbanSearch } from "@/lib/search-params";

export const Route = createFileRoute("/dashboard/kanban")({
  validateSearch: kanbanSearch,
  head: () => ({
    meta: [
      { title: "Open Source Kanban Board with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source Kanban board for organizing work, tracking progress, and managing tasks visually.",
      },
    ],
  }),
  component: Page,
});
