import { type ErrorComponentProps, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function RouteError({ error, reset }: ErrorComponentProps) {
  return (
    <main role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">This page could not be loaded.</h1>
      <p className="text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/default">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
