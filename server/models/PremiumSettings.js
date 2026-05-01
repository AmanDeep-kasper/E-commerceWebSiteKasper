import mongoose from 'mongoose';

const premiumsettingsSchema = new mongoose.Schema({
  homepageFeatures: {
    type: [
      {
        text: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],
    default: []  // Empty array - no default features
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

premiumsettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PremiumSettings', premiumsettingsSchema);