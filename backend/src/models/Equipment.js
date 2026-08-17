const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: String,
    required: true,
    unique: true,
  },
  equipmentType: {
    type: String,
    enum: ['QC', 'RTG', 'STS', 'Reach Stacker', 'Forklift', 'Truck'],
    required: true,
  },
  status: {
    type: String,
    enum: ['idle', 'working', 'maintenance', 'offline'],
    default: 'idle',
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  productivity: {
    type: Number,
    description: 'Moves per hour',
  },
  powerConsumption: {
    type: Number,
    description: 'kWh',
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  operatingHours: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('Equipment', equipmentSchema);
