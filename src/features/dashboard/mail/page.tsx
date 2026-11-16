import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 md:px-6">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-sm leading-none font-medium">Mail preview</h1>
          <p className="text-muted-foreground text-sm">
            This iframe shows the standalone mail screen. Open it in full screen for a better view.
          </p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link to="/mail" target="_blank" rel="noreferrer" aria-label="Open mail in new tab">
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe src="/mail" title="Mail preview" className="bg-background min-h-0 w-full flex-1 border-0" />
    </div>
  );
}
