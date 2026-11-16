import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/crm-v1/page";

export const Route = createFileRoute("/dashboard/crm-v1")({
  head: () => ({
    meta: [
      { title: "Studio Admin" },
      { name: "description", content: "A customizable React admin dashboard built with shadcn/ui." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: Page,
});
