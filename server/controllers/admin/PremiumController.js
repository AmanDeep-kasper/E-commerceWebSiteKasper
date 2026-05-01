import PremiumSettings from '../../models/PremiumSettings';

export const getAllSettings = async (req, res) => {
  try {
    let settings = await PremiumSettings.findOne();
    
    if (!settings) {
      settings = await PremiumSettings.create({});
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const getHomepageFeatures = async (req, res) => {
  try {
    let settings = await PremiumSettings.findOne();
    
    if (!settings) {
      settings = await PremiumSettings.create({});
    }
    
    const activeFeatures = settings.homepageFeatures.filter(f => f.isActive);
    
    res.json({
      success: true,
      data: activeFeatures.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const updateHomepageFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    
    let settings = await PremiumSettings.findOne();
    
    if (!settings) {
      settings = new PremiumSettings();
    }
    
    settings.homepageFeatures = features;
    settings.updatedAt = Date.now();
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings.homepageFeatures,
      message: 'Homepage features updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const addFeature = async (req, res) => {
  try {
    const { icon, text, order } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    let settings = await PremiumSettings.findOne();
    
    if (!settings) {
      settings = new PremiumSettings();
    }
    
    const newFeature = {
      icon: icon || '💎',
      text,
      isActive: true,
      order: order || settings.homepageFeatures.length + 1
    };
    
    settings.homepageFeatures.push(newFeature);
    await settings.save();
    
    res.json({
      success: true,
      data: newFeature,
      message: 'Feature added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const settings = await PremiumSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }
    
    settings.homepageFeatures = settings.homepageFeatures.filter(
      f => f._id.toString() !== req.params.featureId
    );
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const toggleFeatureStatus = async (req, res) => {
  try {
    const settings = await PremiumSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }
    
    const feature = settings.homepageFeatures.find(
      f => f._id.toString() === req.params.featureId
    );
    
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }
    
    feature.isActive = !feature.isActive;
    await settings.save();
    
    res.json({
      success: true,
      data: feature,
      message: `Feature ${feature.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};