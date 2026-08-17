const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
  containerNumber: {
    type: String,
    required: true,
    unique: true,
  },
  containerType: {
    type: String,
    enum: ['20ft', '40ft', 'HC', 'Reefer'],
    required: true,
  },
  weight: {
    type: Number,
    description: 'Weight in kg',
  },
  destination: String,
  origin: String,
  status: {
    type: String,
    enum: ['import', 'export', 'transshipment', 'storage'],
    default: 'import',
  },
  vesselId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
  },
  blockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YardBlock',
  },
  position: {
    row: Number,
    column: Number,
    tier: Number,
  },
  coordinates: {
    x: Number,
    y: Number,
    z: Number,
  },
  lastScanned: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Container', containerSchema);
