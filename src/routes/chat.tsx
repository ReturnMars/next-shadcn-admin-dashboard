import { createFileRoute, Outlet } from "@tanstack/react-router";

import Layout from "@/features/chat/layout";

export const Route = createFileRoute("/chat")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
