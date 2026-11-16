import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import data from "./_components/data.json";
import { ProposalSectionsTable } from "./_components/proposal-sections-table/table";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  return (
    <div data-content-padding="false" className="@container/main flex min-w-0 flex-col">
      <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <SectionCards />
        <ChartAreaInteractive />
      </div>
      <ProposalSectionsTable data={data} />
    </div>
  );
}
