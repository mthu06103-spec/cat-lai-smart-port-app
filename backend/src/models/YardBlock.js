const mongoose = require('mongoose');

const yardBlockSchema = new mongoose.Schema({
  blockName: {
    type: String,
    required: true,
  },
  blockType: {
    type: String,
    enum: ['import', 'export', 'transshipment', 'storage'],
    default: 'storage',
  },
  capacity: {
    type: Number,
    description: 'Maximum container slots',
  },
  containers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Container',
  }],
  location: {
    x: Number,
    y: Number,
  },
  rows: Number,
  columns: Number,
  maxTiers: Number,
  utilizationPercent: {
    type: Number,
    default: 0,
  },
  lastUpdated: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('YardBlock', yardBlockSchema);
