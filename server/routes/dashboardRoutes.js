import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  dashboardSummaryController,
  kpiCardController,
  recentActivitiesController,
  recentOrdersController,
  salesOverviewController,
  topSellingProducts,
} from "../controllers/dashboardController.js";

const router = Router();

router.get("/kpi-cards", authenticate, authorize("admin"), kpiCardController);
router.get(
  "/sales-overview",
  authenticate,
  authorize("admin"),
  salesOverviewController,
);
router.get(
  "/dashboard-summary",
  authenticate,
  authorize("admin"),
  dashboardSummaryController,
);
router.get(
  "/top-selling-products",
  authenticate,
  authorize("admin"),
  topSellingProducts,
);
router.get(
  "/recent-activities",
  authenticate,
  authorize("admin"),
  recentActivitiesController,
);
router.get(
  "/recent-orders",
  authenticate,
  authorize("admin"),
  recentOrdersController,
);

export default router;
