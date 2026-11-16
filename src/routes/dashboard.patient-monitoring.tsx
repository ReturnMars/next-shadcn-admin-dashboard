import { createFileRoute } from "@tanstack/react-router";

import Page from "@/features/dashboard/patient-monitoring/page";

export const Route = createFileRoute("/dashboard/patient-monitoring")({
  head: () => ({
    meta: [
      { title: "Open Source Patient Monitoring Dashboard with shadcn/ui" },
      {
        name: "description",
        content:
          "Explore an open source patient monitoring dashboard with live vital signs, ECG waveforms, patient trends, alarms, and device status.",
      },
    ],
  }),
  component: Page,
});
