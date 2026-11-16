import { getRouteApi, Link } from "@tanstack/react-router";
import { FolderPlus, Grid2X2, List, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { type FileManagerView, files, folders } from "./_components/data";
import { FileGridView } from "./_components/file-grid-view";
import { FileListView } from "./_components/file-list-view";
import { FileManagerToolbar } from "./_components/file-manager-toolbar";
import { FoldersSection } from "./_components/folders-section";

export default function Page() {
  const { view = "grid" } = getRouteApi("/dashboard/file-manager").useSearch();
  const activeView: FileManagerView = view;

  return (
    <div data-content-padding="false" className="flex min-w-0 flex-col gap-0">
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">My files</h1>
            <p className="text-muted-foreground text-sm">Organize, share, and find workspace files.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FolderPlus data-icon="inline-start" />
              New folder
            </Button>
            <Button>
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </div>
        </div>
        <FileManagerToolbar />
        <FoldersSection folders={folders} />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <h2 className="text-lg font-medium">All files</h2>
          <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={activeView} aria-label="File view">
            <ToggleGroupItem value="grid" asChild>
              <Link to="/dashboard/file-manager" search={{ view: "grid" }} replace resetScroll={false}>
                <Grid2X2 />
                Grid View
              </Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" asChild>
              <Link to="/dashboard/file-manager" search={{ view: "list" }} replace resetScroll={false}>
                <List />
                List View
              </Link>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {activeView === "list" ? (
          <FileListView files={files} />
        ) : (
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <FileGridView files={files} />
          </div>
        )}
      </div>
    </div>
  );
}
