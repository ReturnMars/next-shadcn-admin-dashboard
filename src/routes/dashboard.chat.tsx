import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/chat/page";

export const Route = createFileRoute("/dashboard/chat")({
  head: () => ({
    meta: [
      { title: "Studio Admin" },
      { name: "description", content: "A customizable React admin dashboard built with shadcn/ui." },
    ],
  }),
  component: Page,
});
