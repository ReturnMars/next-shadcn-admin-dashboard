import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export default function Page() {
  return (
    <div data-content-padding="false" className="@container/main flex min-w-0 flex-col">
      <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <MetricCards />
        <PerformanceOverview />
      </div>
      <SubscriberOverview />
    </div>
  );
}
