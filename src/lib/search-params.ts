import { z } from "zod";

// Invalid or absent view parameters select the screen's documented default.
// Validation happens once at the route boundary; components receive these unions.
export const fileManagerSearch = z.object({ view: z.enum(["grid", "list"]).catch("grid").optional() });
export const kanbanSearch = z.object({ view: z.enum(["board", "list", "table"]).catch("board").optional() });
