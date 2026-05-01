import mongoose from 'mongoose';

const premiumsettingsSchema = new mongoose.Schema({
  homepageFeatures: {
    type: [
      {
        icon: {
          type: String,
          default: '💎'
        },
        text: {
          type: String,
          required: true,
          trim: true
        },
        isActive: {
          type: Boolean,
          default: true
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ],
    default: [
      { icon: '💎', text: 'Premium Quality Resin', isActive: true, order: 1 },
      { icon: '⭐', text: 'Bubble Free Finish', isActive: true, order: 2 },
      { icon: '🌍', text: 'Pan India Delivery', isActive: true, order: 3 }
    ]
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