import mysql from "mysql2/promise";
import { config } from "../config/config";
import type { SdpReport } from "../types/report";
import { STATUSES } from "../config/constants";

type SdbConfig = typeof config.SDB;

class ShortcodeDB {
  private config: SdbConfig;

  constructor(config: any) {
    this.config = config;
  }
  async uploadSdp(report: SdpReport[]) {
    let uploadStatus = STATUSES.FAILED;
    const connection = await mysql.createConnection({
      host: this.config.HOST,
      database: this.config.NAME,
      user: this.config.USERNAME,
      password: this.config.PASSWORD,
      port: this.config.PORT,
    });

    const values = this.formatSdpValues(report);
    const sql = `INSERT INTO revenue (network, counts, revenue, service, revenue_date, created_on, shortcode) VALUES ${values}`;

    try {
      await connection.beginTransaction();
      await connection.execute(sql);
      await connection.commit();

      uploadStatus = STATUSES.SUCCESS;
    } catch (err) {
      await connection.rollback();
    } finally {
      await connection.end();
      return uploadStatus;
    }
  }

  private formatSdpValues(report: SdpReport[]) {
    const createdAt = new Date().toISOString().slice(1, 10);
    const values = report.map((sdp) => [
      sdp.network,
      sdp.count.toString(),
      sdp.revenue.toString(),
      sdp.service,
      sdp.revenueDate,
      createdAt,
      sdp.shortcode,
    ]);
    const rows = values.map((value) => `(${value.join(", ")})`);
    return rows.join(", ");
  }
}

const shortcodeDb = new ShortcodeDB(config.SDB);

export { shortcodeDb };
