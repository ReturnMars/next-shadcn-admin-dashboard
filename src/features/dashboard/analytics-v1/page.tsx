import { ActionsManagerQueue } from "./_components/analytics-actions-manager-queue";
import { ActionsRiskLedger } from "./_components/analytics-actions-risk-ledger";
import { DriversCoverageTriage } from "./_components/analytics-drivers-coverage-triage";
import { DriversForecastTarget } from "./_components/analytics-drivers-forecast-target";
import { AnalyticsOverview } from "./_components/analytics-overview";

export default function Page() {
  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col">
      <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <AnalyticsOverview />

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <DriversForecastTarget />
            <DriversCoverageTriage />
          </div>
          <ActionsManagerQueue />
        </div>
      </div>
      <ActionsRiskLedger />
    </div>
  );
}
