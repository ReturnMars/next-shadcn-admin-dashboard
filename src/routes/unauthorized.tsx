import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/unauthorized/page";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Studio Admin" },
      { name: "description", content: "A customizable React admin dashboard built with shadcn/ui." },
    ],
  }),
  component: Page,
});
