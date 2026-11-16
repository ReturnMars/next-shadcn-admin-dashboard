import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { GitHubStarButton } from "./github-star-button";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";
export function Intro() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl" id="hero-title">
          A polished admin dashboard built to fit your stack and the way you work.
        </h1>
        <p className="text-muted-foreground text-sm leading-6 sm:text-base">
          React, TanStack Router, and shadcn/ui — with customizable themes and layouts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button asChild>
          <Link to="/dashboard/default">
            Live demo
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
        <GitHubStarButton initialCount={null} repositoryUrl={repositoryUrl} />
      </div>
    </div>
  );
}
