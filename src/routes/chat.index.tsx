import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/chat/page";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Open Source Chat Interface with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source chat interface with conversation search, message threads, internal notes, and contact details.",
      },
    ],
  }),
  component: Page,
});
