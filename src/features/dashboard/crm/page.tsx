import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { PipelineActivity } from "./_components/pipeline-activity";
import { TaskReminders } from "./_components/task-reminders";

export default function Page() {
  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col">
      <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <KpiCards />
        <PipelineActivity />
        <TaskReminders />
      </div>
      <OpportunitiesSection />
    </div>
  );
}
