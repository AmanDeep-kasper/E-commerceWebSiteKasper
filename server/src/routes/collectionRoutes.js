import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  addCollection,
  deleteCollection,
  getAllCollections,
  getAllCollectionsController,
  getCollection,
  removeProductFromCollection,
  toggleCollectionStatus,
  updateCollection,
} from "../controllers/collectionController.js";

const router = Router();

// admin routes
router.post(
  "/admin/add-collection",
  authenticate,
  authorize("admin"),
  addCollection,
);

router.get(
  "/admin/get-all-collections",
  authenticate,
  authorize("admin"),
  getAllCollections,
);

router.get(
  "/admin/get-collection/:collectionId",
  authenticate,
  authorize("admin"),
  getCollection,
);

router.patch(
  "/admin/update-collection/:collectionId",
  authenticate,
  authorize("admin"),
  updateCollection,
);

router.delete(
  "/admin/delete-collection/:collectionId",
  authenticate,
  authorize("admin"),
  deleteCollection,
);

router.delete(
  "/admin/delete-product/:collectionId",
  authenticate,
  authorize("admin"),
  removeProductFromCollection,
);

router.patch(
  "/admin/toggle-status/:collectionId",
  authenticate,
  authorize("admin"),
  toggleCollectionStatus,
);

// users routes
router.get("/get-all-collections", getAllCollectionsController);

export default router;
