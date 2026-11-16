import { recentLeadsData } from "./_components/crm.config";
import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import { OverviewCards } from "./_components/overview-cards";
import { RecentLeadsTable } from "./_components/recent-leads-table/table";

export default function Page() {
  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col">
      <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <OverviewCards />
        <InsightCards />
        <OperationalCards />
      </div>
      <RecentLeadsTable data={recentLeadsData} />
    </div>
  );
}
