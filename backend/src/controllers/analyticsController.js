const Analytics = require('../models/Analytics');
const Berth = require('../models/Berth');
const Container = require('../models/Container');
const logger = require('../utils/logger');

/**
 * Get KPI Metrics
 * Turnaround Time, Crane Productivity, Power Consumption, etc.
 */
exports.getKPIMetrics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const analytics = await Analytics.find(filter);

    const metrics = {
      averageTurnaroundTime: calculateAverage(analytics, 'turnaroundTime'),
      craneProductivity: calculateAverage(analytics, 'craneProductivity'),
      powerConsumption: calculateTotal(analytics, 'powerConsumption'),
      containerPositioningAccuracy: calculateAverage(analytics, 'accuracy'),
      safetyIncidents: analytics.filter(a => a.incident).length,
    };

    res.status(200).json({ data: metrics });
  } catch (error) {
    next(error);
  }
};

/**
 * Get structural fatigue prediction
 */
exports.getStructuralFatigue = async (req, res, next) => {
  try {
    const fatigueData = await Analytics.find({ type: 'fatigue' }).sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ data: fatigueData });
  } catch (error) {
    next(error);
  }
};

/**
 * Get erosion forecast
 */
exports.getErosionForecast = async (req, res, next) => {
  try {
    const erosionData = await Analytics.find({ type: 'erosion' }).sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ data: erosionData });
  } catch (error) {
    next(error);
  }
};

/**
 * Get comprehensive dashboard data
 */
exports.getDashboardData = async (req, res, next) => {
  try {
    const kpi = await exports.getKPIMetrics(req, res, () => {});
    const fatigue = await Analytics.findOne({ type: 'fatigue' }).sort({ timestamp: -1 });
    const erosion = await Analytics.findOne({ type: 'erosion' }).sort({ timestamp: -1 });

    res.status(200).json({
      data: {
        kpi: kpi?.data || {},
        fatigue,
        erosion,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get historical trends
 */
exports.getTrends = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Analytics.find({
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });

    res.status(200).json({ data: trends });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function calculateAverage(arr, field) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, item) => acc + (item[field] || 0), 0);
  return sum / arr.length;
}

function calculateTotal(arr, field) {
  return arr.reduce((acc, item) => acc + (item[field] || 0), 0);
}
