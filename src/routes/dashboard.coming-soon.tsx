import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/coming-soon/page";

export const Route = createFileRoute("/dashboard/coming-soon")({
  head: () => ({
    meta: [
      { title: "Studio Admin" },
      { name: "description", content: "A customizable React admin dashboard built with shadcn/ui." },
    ],
  }),
  component: Page,
});
