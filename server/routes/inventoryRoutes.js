import { Router } from "express";
import {
  adjustStock,
  getInventory,
} from "../controllers/inventoryController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/get-inventory", authenticate, authorize("admin"), getInventory);
router.post("/adjust-stock", authenticate, authorize("admin"), adjustStock);

export default router;
