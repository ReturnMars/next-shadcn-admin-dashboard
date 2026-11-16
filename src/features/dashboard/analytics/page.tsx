import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col gap-4 py-4 md:py-6">
      <div className="space-y-1 px-4 md:px-6">
        <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
        <p className="text-muted-foreground text-sm">
          Monitor traffic, engagement, and conversion performance in one view.
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6">
          <div className="max-w-full overflow-x-auto">
            <TabsList className="gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>
          </div>

          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="px-4 md:px-6">
            <AnalyticsKpiStrip />
          </div>

          <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 px-4 md:px-6 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 items-stretch xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-7 xl:border-r">
              <TopPages />
            </div>
            <div className="p-4 md:p-6 xl:col-span-5 xl:col-start-8 xl:py-0">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="px-4 md:px-6">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Audience view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="acquisition" className="px-4 md:px-6">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Acquisition view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="px-4 md:px-6">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Engagement view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="conversions" className="px-4 md:px-6">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Conversions view coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
