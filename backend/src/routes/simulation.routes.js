const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

/**
 * POST /api/simulation/create
 * Create new simulation scenario
 */
router.post('/create', simulationController.createSimulation);

/**
 * POST /api/simulation/:simulationId/run
 * Run simulation
 */
router.post('/:simulationId/run', simulationController.runSimulation);

/**
 * GET /api/simulation/:simulationId/results
 * Get simulation results
 */
router.get('/:simulationId/results', simulationController.getSimulationResults);

/**
 * GET /api/simulation/scenarios
 * Get all saved simulation scenarios
 */
router.get('/scenarios', simulationController.getScenarios);

module.exports = router;
