import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/mail/page";

export const Route = createFileRoute("/mail/")({
  head: () => ({
    meta: [
      { title: "Open Source Email Client with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source email client with inbox navigation, message search, reading, replying, and archiving.",
      },
    ],
  }),
  component: Page,
});
