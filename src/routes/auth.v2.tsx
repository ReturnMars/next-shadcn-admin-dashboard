import { createFileRoute, Outlet } from "@tanstack/react-router";

import Layout from "@/features/auth/v2/layout";

export const Route = createFileRoute("/auth/v2")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
