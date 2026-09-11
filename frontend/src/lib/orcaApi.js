import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 15000 });

// Alerts
export const fetchAlerts = () => api.get("/alerts").then((r) => r.data);
export const seedAlerts = () => api.post("/alerts/seed").then((r) => r.data);

// Reports
export const fetchReports = () => api.get("/reports").then((r) => r.data);
export const createReport = (payload) => api.post("/reports", payload).then((r) => r.data);
export const advanceReport = (reportId) =>
  api.patch(`/reports/${reportId}/advance`).then((r) => r.data);

// Stats
export const fetchStats = () => api.get("/stats").then((r) => r.data);
