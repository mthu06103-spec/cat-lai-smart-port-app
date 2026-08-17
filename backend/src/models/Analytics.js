const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['kpi', 'fatigue', 'erosion', 'performance'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // KPI Metrics
  turnaroundTime: Number,
  craneProductivity: Number,
  powerConsumption: Number,
  accuracy: Number,
  incident: Boolean,
  
  // Structural Fatigue
  fatigueLevel: Number,
  strainData: [{
    sensorId: String,
    value: Number,
    timestamp: Date,
  }],
  lidarData: {
    scanId: String,
    anomalies: Number,
  },
  
  // Erosion Forecast
  waveHeight: Number,
  currentSpeed: Number,
  erosionRisk: String,
  erosionRate: Number,
  
  // Metadata
  berthId: mongoose.Schema.Types.ObjectId,
  vesselId: mongoose.Schema.Types.ObjectId,
  dataSource: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
