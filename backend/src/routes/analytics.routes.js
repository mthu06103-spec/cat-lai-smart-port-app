const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * GET /api/analytics/kpi
 * Get KPI metrics (Turnaround Time, Productivity, Power Consumption, etc.)
 */
router.get('/kpi', analyticsController.getKPIMetrics);

/**
 * GET /api/analytics/fatigue
 * Get structural fatigue prediction data
 */
router.get('/fatigue', analyticsController.getStructuralFatigue);

/**
 * GET /api/analytics/erosion
 * Get hydrodynamic erosion forecast
 */
router.get('/erosion', analyticsController.getErosionForecast);

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard data
 */
router.get('/dashboard', analyticsController.getDashboardData);

/**
 * GET /api/analytics/trends
 * Get historical trends
 */
router.get('/trends', analyticsController.getTrends);

module.exports = router;
