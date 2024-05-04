import { model, Schema } from "mongoose";
import { SdpReportDocument } from "../types/report";

const RequiredString = { type: String, required: true };
const RequiredNumber = { type: Number, required: true };

const ReportSchema = new Schema(
  {
    network: RequiredString,
    count: RequiredNumber,
    revenue: RequiredNumber,
    service: RequiredString,
    revenueDate: { type: Date, required: true },
    shortcode: RequiredString,
  },
  { timestamps: true }
);

export default model<SdpReportDocument>("Report", ReportSchema);
