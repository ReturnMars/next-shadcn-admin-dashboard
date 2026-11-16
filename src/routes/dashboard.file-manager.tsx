import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/file-manager/page";
import { fileManagerSearch } from "@/lib/search-params";

export const Route = createFileRoute("/dashboard/file-manager")({
  validateSearch: fileManagerSearch,
  head: () => ({
    meta: [
      { title: "Open Source File Manager with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source file manager for browsing, organizing, uploading, and viewing files and folders.",
      },
    ],
  }),
  component: Page,
});
