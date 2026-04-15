import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware";
import {
  createPolicy,
  getPolicy,
  updatePolicy,
} from "../../controllers/admin/policyController";

const router = Router();

router.post("/create-policy", authenticate, authorize("admin"), createPolicy);
router.put(
  "/update-policy/:policyId",
  authenticate,
  authorize("admin"),
  updatePolicy,
);
router.get("/get-policy", getPolicy);

export default router;
