import { createFileRoute, Outlet } from "@tanstack/react-router";

import Layout from "@/features/mail/layout";

export const Route = createFileRoute("/mail")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
