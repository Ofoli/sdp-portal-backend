import fs from "fs";
import mysql, { Connection } from "mysql2/promise";
import { Client } from "ssh2";
import { config } from "../config/config";
import { logger } from "./logger";
import { STATUSES } from "../config/constants";
import type { SdpReport } from "../types/report";

type ShortcodeConfig = {
  db: typeof config.SDB;
  ssh: typeof config.SSH;
};

class ShortcodeDbConnector {
  private config: ShortcodeConfig;

  constructor(config: ShortcodeConfig) {
    this.config = config;
  }

  private establishSshTunnel(): Promise<Client> {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn
        .on("ready", () => {
          logger.info("SSH tunnel established.");
          resolve(conn);
        })
        .on("error", (err) => {
          reject(err);
        })
        .connect({
          host: this.config.ssh.HOST,
          username: this.config.ssh.USER,
          privateKey: fs.readFileSync(this.config.ssh.PRIVATE_KEY_PATH),
        });
    });
  }

  private handleForwarding(
    resolve: (connection: Connection) => void,
    reject: (err: Error) => void
  ) {
    return async (err: Error | undefined, stream: NodeJS.ReadWriteStream) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const connection = await mysql.createConnection({
          host: this.config.db.HOST,
          port: this.config.db.PORT,
          user: this.config.db.USERNAME,
          database: this.config.db.NAME,
          password: this.config.db.PASSWORD,
          stream,
        });
        resolve(connection);
      } catch (dbErr) {
        reject(dbErr as Error);
      }
    };
  }

  private createDbConnection(sshClient: Client): Promise<Connection> {
    return new Promise((resolve, reject) => {
      sshClient.forwardOut(
        this.config.db.HOST,
        this.config.db.PORT,
        this.config.db.HOST,
        this.config.db.PORT,
        this.handleForwarding(resolve, reject)
      );
    });
  }

  public async connect() {
    try {
      const sshClient = await this.establishSshTunnel();
      return this.createDbConnection(sshClient);
    } catch (err) {
      const { message } = err as Error;
      logger.error({
        action: "get sdb connection",
        details: message,
      });
      return null;
    }
  }
}

class ShortcodeDB {
  private dbConnector: ShortcodeDbConnector;

  constructor(connector: ShortcodeDbConnector) {
    this.dbConnector = connector;
  }

  async uploadSdp(report: SdpReport[]) {
    let uploadStatus = STATUSES.FAILED;

    const connection = await this.dbConnector.connect();
    if (!connection) return uploadStatus;

    const values = this.formatSdpValues(report);
    const sql = `INSERT INTO revenue (network, counts, revenue, service, revenue_date, created_on, shortcode) VALUES ${values}`;

    try {
      await connection.beginTransaction();
      await connection.execute(sql);
      await connection.commit();
      uploadStatus = STATUSES.SUCCESS;
    } catch (err) {
      await connection.rollback();
      logger.error({ action: "uploadSdp", err, sql });
    } finally {
      await connection.end();
    }
    return uploadStatus;
  }

  private formatSdpValues(report: SdpReport[]) {
    const createdAt = new Date().toISOString().slice(0, 10);
    const values = report.map((sdp) => [
      sdp.network,
      sdp.count.toString(),
      sdp.revenue.toString(),
      sdp.service,
      sdp.revenueDate,
      createdAt,
      sdp.shortcode,
    ]);
    const rows = values.map((value) => `('${value.join("', '")}')`);
    return rows.join(", ");
  }
}

const connector = new ShortcodeDbConnector({ db: config.SDB, ssh: config.SSH });
const shortcodeDb = new ShortcodeDB(connector);

export { shortcodeDb };
