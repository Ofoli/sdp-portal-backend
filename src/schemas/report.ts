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
  user: z.string(),
  report: z.array(reportSchema),
});

export const queryReportSchema = z.object({
  date: z.string(),
  type: z.union([z.literal("daily"), z.literal("monthly")]),
});
