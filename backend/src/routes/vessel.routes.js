const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');

/**
 * GET /api/vessel
 * Get all vessels
 */
router.get('/', vesselController.getAllVessels);

/**
 * GET /api/vessel/:vesselId
 * Get vessel details
 */
router.get('/:vesselId', vesselController.getVesselDetails);

/**
 * POST /api/vessel/register
 * Register new vessel arrival
 */
router.post('/register', vesselController.registerVessel);

/**
 * PUT /api/vessel/:vesselId/status
 * Update vessel status
 */
router.put('/:vesselId/status', vesselController.updateVesselStatus);

module.exports = router;
