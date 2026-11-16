import { z } from "zod";

export const MAIL_LAYOUT_COOKIE = "mail_panel_layout";

export const MAIL_LIST_PANEL_ID = "mail-message-list-panel";
export const MAIL_DETAIL_PANEL_ID = "mail-message-detail-panel";

export const DEFAULT_MAIL_LAYOUT = [38, 62] as const;

const mailLayoutSchema = z
  .tuple([z.number().min(10).max(90), z.number().min(10).max(90)])
  .refine(([list, detail]) => Math.abs(list + detail - 100) < 1);

export function parseMailLayout(cookie: string | undefined): number[] {
  if (!cookie) return [...DEFAULT_MAIL_LAYOUT];
  try {
    const result = mailLayoutSchema.safeParse(JSON.parse(cookie));
    if (result.success) return result.data;
  } catch {
    // A corrupt browser preference must not prevent opening the mailbox.
  }
  console.warn("Invalid saved mail layout; restoring the default panel sizes.");
  return [...DEFAULT_MAIL_LAYOUT];
}
