import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

import NotFound from "@/app/not-found";
import { RouteError } from "@/app/route-error";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_CONFIG } from "@/config/app-config";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: APP_CONFIG.meta.title }, { name: "description", content: APP_CONFIG.meta.description }],
  }),
  notFoundComponent: NotFound,
  errorComponent: RouteError,
  pendingComponent: () => (
    <p role="status" className="text-muted-foreground p-6 text-sm">
      Loading…
    </p>
  ),
  component: () => (
    <TooltipProvider>
      <HeadContent />
      <Outlet />
      <Toaster />
    </TooltipProvider>
  ),
});
