import { Router } from "express";
import { adjustStock } from "../controllers/inventoryController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/adjust-stock", authenticate, authorize("admin"), adjustStock);

export default router;
