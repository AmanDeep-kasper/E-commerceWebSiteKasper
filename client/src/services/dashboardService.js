import axiosInstance from "../api/axiosInstance";

export const getKpiCards = () => axiosInstance.get("/dashboard/kpi-cards");

export const getSalesOverview = (type = "orders", range = "weekly") =>
  axiosInstance.get(`/dashboard/sales-overview?type=${type}&range=${range}`);

export const getDashboardSummary = () =>
  axiosInstance.get("/dashboard/dashboard-summary");

export const getTopSellingProducts = (range = "weekly") =>
  axiosInstance.get(
    `/dashboard/top-selling-products?range=${range}&page=1&limit=5`,
  );

export const getRecentOrders = () =>
  axiosInstance.get("/dashboard/recent-orders");

export const getRecentActivities = () =>
  axiosInstance.get("/dashboard/recent-activities");
