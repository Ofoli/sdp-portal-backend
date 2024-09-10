import path from "path";

const FE_URL_DEV = "http://localhost:5173";
const FE_URL_LIVE = "https://sandboxes.nalosolutions.com";

export const ENV_FILE_PATH = path.join(__dirname, "..", "..", ".env");
export const MONGO_DB_HOST = "mongodb://db";
export const STATUSES = { SUCCESS: true, FAILED: false };
export const CORS_OPTIONS = {
  origin: [FE_URL_DEV, FE_URL_LIVE],
  credentials: true,
};
export const URLS = {
  base: "/",
  auth: "/api/auth",
  users: "/api/users",
  report: {
    add: "/api/report",
    query: "/api/report/:id",
    history: "/api/report/:id/history",
    recents: "/api/report/:id/recent-dates",
  },
  recentActivity: "/api/:id/recent-activities",

  notFound: "*",
};
