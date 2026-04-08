import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  addCollection,
  addProductToCollection,
  deleteCollection,
  getAllCollections,
  getAllCollectionsController,
  getCollection,
  removeProductFromCollection,
  toggleCollectionStatus,
  updateCollection,
} from "../controllers/collectionController.js";

import { validateRequest } from "../validation/validator.js";
import {
  addCollectionValidation,
  updateCollectionValidation,
  addProductToCollectionValidation,
  removeProductFromCollectionValidation,
  collectionIdValidation,
  queryValidation,
} from "../validation/collectionValidation.js";

const router = Router();

// admin routes
router.post(
  "/admin/add-collection",
  authenticate,
  authorize("admin"),
  addCollectionValidation,
  validateRequest,
  addCollection,
);

router.get(
  "/admin/get-all-collections",
  authenticate,
  authorize("admin"),
  queryValidation,
  validateRequest,
  getAllCollections,
);

router.get(
  "/admin/get-collection/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  validateRequest,
  getCollection,
);

router.patch(
  "/admin/update-collection/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  updateCollectionValidation,
  validateRequest,
  updateCollection,
);

router.post(
  "/admin/add-product/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  addProductToCollectionValidation,
  validateRequest,
  addProductToCollection,
);

router.delete(
  "/admin/delete-collection/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  validateRequest,
  deleteCollection,
);

router.delete(
  "/admin/delete-product/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  removeProductFromCollectionValidation,
  validateRequest,
  removeProductFromCollection,
);

router.patch(
  "/admin/toggle-status/:collectionId",
  authenticate,
  authorize("admin"),
  collectionIdValidation,
  validateRequest,
  toggleCollectionStatus,
);

// users routes
router.get(
  "/get-all-collections",
  queryValidation,
  validateRequest,
  getAllCollectionsController,
);

export default router;
