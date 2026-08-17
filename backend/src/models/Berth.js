const mongoose = require('mongoose');

const berthSchema = new mongoose.Schema({
  berthName: {
    type: String,
    required: true,
  },
  berthNumber: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    description: 'Berth length in meters',
  },
  depth: {
    type: Number,
    description: 'Water depth in meters',
  },
  maxVesselSize: {
    type: Number,
    description: 'Maximum vessel size in TEU',
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available',
  },
  assignedVessel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
  },
  availableCranes: {
    type: Number,
    default: 3,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Berth', berthSchema);
