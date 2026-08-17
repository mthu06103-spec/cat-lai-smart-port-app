const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  vesselName: {
    type: String,
    required: true,
  },
  imo: {
    type: String,
    unique: true,
  },
  callSign: String,
  vesselType: {
    type: String,
    enum: ['Container Ship', 'General Cargo', 'Bulk Carrier'],
  },
  capacity: {
    type: Number,
    description: 'Vessel capacity in TEU',
  },
  weight: {
    type: Number,
    description: 'Deadweight in tonnes',
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureTime: Date,
  berthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Berth',
  },
  containerCount: Number,
  importsCount: Number,
  exportsCount: Number,
  transshipmentCount: Number,
  status: {
    type: String,
    enum: ['scheduled', 'arrived', 'berthing', 'loading', 'unloading', 'departed'],
    default: 'scheduled',
  },
  craneAssignments: [{
    craneId: String,
    assignedTime: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vessel', vesselSchema);
