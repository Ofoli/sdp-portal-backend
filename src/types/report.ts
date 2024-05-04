import { z } from "zod";
import { reportSchema, addReportSchema } from "../schemas/report";

export type SdpReport = z.infer<typeof reportSchema>;
export type SdpReportPayload = z.infer<typeof addReportSchema>;
export interface SdpReportDocument extends SdpReport, Document {}
