import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/finance/page";

export const Route = createFileRoute("/dashboard/finance")({
  head: () => ({
    meta: [
      { title: "Open Source Finance Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source personal finance dashboard with net worth, spending, income sources, account allocation, transactions, and wallets.",
      },
    ],
  }),
  component: Page,
});
