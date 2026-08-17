const express = require('express');
const router = express.Router();
const berthController = require('../controllers/berthController');

/**
 * POST /api/berth/optimize
 * Optimize berth allocation for incoming vessels
 * Body: { vesselId, arrivalTime, requiredCranes, containerCount }
 */
router.post('/optimize', berthController.optimizeBerthAllocation);

/**
 * GET /api/berth/schedule
 * Get current berth schedule
 */
router.get('/schedule', berthController.getBerthSchedule);

/**
 * GET /api/berth/:berthId/status
 * Get status of specific berth
 */
router.get('/:berthId/status', berthController.getBerthStatus);

/**
 * GET /api/berth
 * Get all berths
 */
router.get('/', berthController.getAllBerths);

/**
 * PUT /api/berth/:berthId
 * Update berth information
 */
router.put('/:berthId', berthController.updateBerth);

module.exports = router;
