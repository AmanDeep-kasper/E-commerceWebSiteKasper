import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  createWarehouse,
  getWarehouse,
  updateWarehouse,
} from "../../controllers/admin/warehouseController.js";

const router = Router();

router.post(
  "/create-warehouse",
  authenticate,
  authorize("admin"),
  createWarehouse,
);

router.put(
  "/update-warehouse",
  authenticate,
  authorize("admin"),
  updateWarehouse,
);

router.get("/get-warehouse", authenticate, authorize("admin"), getWarehouse);

export default router;
