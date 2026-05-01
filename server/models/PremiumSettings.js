const mongoose = require('mongoose');

const premiumsettingsSchema = new mongoose.Schema({
  homepageFeatures: {
    type: [
      {
        icon: {
          type: String,
          enum: ['diamond', 'star', 'earth', 'truck', 'shield', 'heart', 'clock'],
          default: 'diamond'
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
      { icon: 'diamond', text: 'Premium Quality Resin', isActive: true, order: 1 },
      { icon: 'star', text: 'Bubble Free Finish', isActive: true, order: 2 },
      { icon: 'earth', text: 'Pan India Delivery', isActive: true, order: 3 }
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

module.exports = mongoose.model('PremiumSettings', premiumsettingsSchema);