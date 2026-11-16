import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export default function Page() {
  return (
    <div
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col"
    >
      <div className="shrink-0 px-4 py-4 md:px-6">
        <h2 className="text-3xl tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's a list of your tasks for this month!</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
