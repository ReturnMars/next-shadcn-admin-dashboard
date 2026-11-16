import { Download, FileText, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ProfileDocument } from "./profile-data";

export function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <h2 className="font-heading text-base font-medium">Documents</h2>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Add document
        </Button>
      </div>

      <Table className="table-compact border-y">
        <TableCaption className="sr-only">Documents attached to this contractor profile</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-2/5">
              <span className="sr-only">Document</span>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.name}</TableCell>
              <TableCell className="text-muted-foreground">{document.category}</TableCell>
              <TableCell className="text-muted-foreground">{document.updatedAt}</TableCell>
              <TableCell>
                <Badge className="rounded-sm" variant="outline">
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {document.isRestricted ? (
                  <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs" title="Restricted">
                    <LockKeyhole aria-hidden="true" className="size-3.5" />
                    Restricted
                  </span>
                ) : (
                  <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost">
                    <Download />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
