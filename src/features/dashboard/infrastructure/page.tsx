import { infrastructureGroups } from "./_components/infrastructure-data";
import { InfrastructureHeader } from "./_components/infrastructure-header";
import { ProjectEnvironments } from "./_components/project-environments";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col">
      <div className="p-4 md:p-6">
        <InfrastructureHeader />
      </div>

      <div className="flex min-w-0 flex-col">
        {infrastructureGroups.map((group) => (
          <ProjectEnvironments key={group.name} group={group} />
        ))}
      </div>
    </div>
  );
}
