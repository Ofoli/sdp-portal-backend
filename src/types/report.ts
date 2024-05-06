import { z } from "zod";
import {
  reportSchema,
  addReportSchema,
  queryReportSchema,
} from "../schemas/report";

export type SdpReport = z.infer<typeof reportSchema>;
export type SdpReportPayload = z.infer<typeof addReportSchema>;
export type SdpQueryParams = z.infer<typeof queryReportSchema>;
export interface SdpReportDocument extends SdpReport, Document {}
