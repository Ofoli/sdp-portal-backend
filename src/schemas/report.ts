import { z } from "zod";

export const reportSchema = z.object({
  count: z.number(),
  revenue: z.number(),
  network: z.string(),
  service: z.string(),
  revenueDate: z.date(),
  shortcode: z.string(),
});

export const addReportSchema = z.object({
  report: z.array(reportSchema),
});
