import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  upsertWarehouse,
  getWarehouse,
} from "../../controllers/admin/warehouseController.js";

const router = Router();

router.post("/", authenticate, authorize("admin"), upsertWarehouse);
router.get("/get-warehouse", authenticate, authorize("admin"), getWarehouse);

export default router;
