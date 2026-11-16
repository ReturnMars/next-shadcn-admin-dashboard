import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/products/page";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({
    meta: [
      { title: "Open Source Product Management Dashboard with shadcn/ui" },
      {
        name: "description",
        content: "Manage an ecommerce product catalog with categories, inventory, availability, pricing, and sales.",
      },
    ],
  }),
  component: Page,
});
