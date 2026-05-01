import express from 'express';
import { protect, admin } from '../../middlewares/authMiddleware.js';
import {
  getAllSettings,
  getHomepageFeatures,
  updateHomepageFeatures,
  addFeature,
  deleteFeature,
  toggleFeatureStatus
} from '../../controllers/admin/PremiumController.js'; // ← Fix path

const router = express.Router();

// Public routes
router.get('/', getAllSettings);
router.get('/homepage-features', getHomepageFeatures);

// Admin only routes
router.put('/homepage-features', protect, admin, updateHomepageFeatures);
router.post('/homepage-features', protect, admin, addFeature);
router.delete('/homepage-features/:featureId', protect, admin, deleteFeature);
router.patch('/homepage-features/:featureId/toggle', protect, admin, toggleFeatureStatus);

export default router; // ← Use export default