export const MONGO_DB_HOST = "mongodb://db";
export const STATUSES = {
  SUCCESS: true,
  FAILED: false,
};
export const URLS = {
  base: "/",
  auth: "/api/auth",
  users: "/api/users",
  report: {
    add: "/api/report",
    query: "/api/report/:id",
    history: "/api/report/history/:id",
    recents: "/api/report/recent-dates/:id",
  },
  recentActivity: "/api/:id/recent-activities",

  notFound: "*",
};
