import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  updateAddressStatus,
} from "../controllers/addressController.js";
import { validateRequest } from "../validation/validator.js";
import {
  addAddressValidation,
  updateAddressValidation,
} from "../validation/addressValidation.js";

const router = express.Router();

// users routes
router.post(
  "/add-address",
  authenticate,
  authorize("user"),
  addAddressValidation,
  validateRequest,
  addAddress,
);

router.get("/all-addresses", authenticate, authorize("user"), getAddresses);

router.put(
  "/update-address/:addressId",
  authenticate,
  authorize("user"),
  updateAddressValidation,
  validateRequest,
  updateAddress,
);

router.delete(
  "/delete-address/:addressId",
  authenticate,
  authorize("user"),
  deleteAddress,
);

router.get(
  "/address-detail/:addressId",
  authenticate,
  authorize("user"),
  getAddress,
);

router.patch(
  "/set-default-address/:addressId",
  authenticate,
  authorize("user"),
  setDefaultAddress,
);

router.patch(
  "/update-status/:addressId",
  authenticate,
  authorize("user"),
  updateAddressStatus,
);

// add this two new route
// Add these admin routes after your existing routes
// Admin routes
router.get(
  "/admin/all-addresses/:userId",
  authenticate,
  authorize("admin"),
  getAddressesByUserId
);

router.get(
  "/admin/address-detail/:addressId",
  authenticate,
  authorize("admin"),
  getAddressById
);

export default router;
