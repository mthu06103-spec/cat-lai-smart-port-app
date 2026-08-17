const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['berth-optimization', 'yard-optimization', 'full-simulation'],
    default: 'full-simulation',
  },
  status: {
    type: String,
    enum: ['created', 'running', 'completed', 'failed'],
    default: 'created',
  },
  parameters: {
    duration: Number,
    vesselCount: Number,
    containerCount: Number,
    craneCount: Number,
  },
  results: {
    turnaroundTime: Number,
    productivity: Number,
    costSavings: Number,
    emissions: Number,
  },
  startTime: Date,
  endTime: Date,
  executionTime: Number,
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Simulation', simulationSchema);
