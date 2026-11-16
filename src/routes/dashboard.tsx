import { createFileRoute, Outlet } from "@tanstack/react-router";

import Layout from "@/features/dashboard/layout";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
