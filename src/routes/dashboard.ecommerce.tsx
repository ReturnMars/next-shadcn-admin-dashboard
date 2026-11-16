import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/ecommerce/page";

export const Route = createFileRoute("/dashboard/ecommerce")({
  head: () => ({
    meta: [
      { title: "Open Source E-commerce Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source e-commerce dashboard with sales metrics, orders, store traffic, inventory, products, and reviews.",
      },
    ],
  }),
  component: Page,
});
