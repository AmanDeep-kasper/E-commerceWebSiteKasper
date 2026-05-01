const express = require('express');
const router = express.Router();
const { protect, admin } = require('../../middlewares/authMiddleware');
const {
  getAllSettings,
  getHomepageFeatures,
  updateHomepageFeatures,
  addFeature,
  deleteFeature,
  toggleFeatureStatus
} = require('../../controllers/admin/PremiumController');

// Public routes
router.get('/', getAllSettings);
router.get('/homepage-features', getHomepageFeatures);

// Admin only routes
router.put('/homepage-features', protect, admin, updateHomepageFeatures);
router.post('/homepage-features', protect, admin, addFeature);
router.delete('/homepage-features/:featureId', protect, admin, deleteFeature);
router.patch('/homepage-features/:featureId/toggle', protect, admin, toggleFeatureStatus);

module.exports = router;