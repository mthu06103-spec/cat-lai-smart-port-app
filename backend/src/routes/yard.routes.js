const express = require('express');
const router = express.Router();
const yardController = require('../controllers/yardController');

/**
 * POST /api/yard/optimize
 * Optimize container stacking in yard
 */
router.post('/optimize', yardController.optimizeYardStacking);

/**
 * GET /api/yard/blocks
 * Get all yard blocks information
 */
router.get('/blocks', yardController.getYardBlocks);

/**
 * GET /api/yard/utilization
 * Get yard utilization metrics
 */
router.get('/utilization', yardController.getYardUtilization);

/**
 * PUT /api/yard/container/:containerId
 * Update container position
 */
router.put('/container/:containerId', yardController.updateContainerPosition);

/**
 * GET /api/yard/heatmap
 * Get yard density heatmap
 */
router.get('/heatmap', yardController.getYardHeatmap);

module.exports = router;
