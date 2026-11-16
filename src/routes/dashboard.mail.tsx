import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/mail/page";

export const Route = createFileRoute("/dashboard/mail")({
  head: () => ({
    meta: [
      { title: "Studio Admin" },
      { name: "description", content: "A customizable React admin dashboard built with shadcn/ui." },
    ],
  }),
  component: Page,
});
