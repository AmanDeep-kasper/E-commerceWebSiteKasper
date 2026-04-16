import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  getPolicy,
  upsertPolicies,
} from "../../controllers/admin/policyController.js";

const router = Router();

router.post(
  "/upsert-policies",
  authenticate,
  authorize("admin"),
  upsertPolicies,
);

router.get("/get-policy", getPolicy);

export default router;
