const Simulation = require('../models/Simulation');
const desEngine = require('../services/simulations/desEngine');
const logger = require('../utils/logger');

/**
 * Create new simulation scenario
 */
exports.createSimulation = async (req, res, next) => {
  try {
    const { name, description, parameters } = req.body;

    const simulation = new Simulation({
      name,
      description,
      parameters,
      status: 'created',
      createdAt: new Date(),
    });

    await simulation.save();

    logger.info(`Simulation created: ${simulation._id}`);

    res.status(201).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Run simulation
 */
exports.runSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.simulationId);

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    logger.info(`Running simulation: ${simulation._id}`);

    simulation.status = 'running';
    simulation.startTime = new Date();
    await simulation.save();

    // Run DES engine
    const results = await desEngine.runSimulation(simulation.parameters);

    simulation.status = 'completed';
    simulation.endTime = new Date();
    simulation.results = results;
    await simulation.save();

    logger.info(`Simulation completed: ${simulation._id}`);

    res.status(200).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get simulation results
 */
exports.getSimulationResults = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.simulationId);

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    res.status(200).json({
      data: {
        simulationId: simulation._id,
        status: simulation.status,
        results: simulation.results,
        executionTime: simulation.endTime - simulation.startTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all saved scenarios
 */
exports.getScenarios = async (req, res, next) => {
  try {
    const scenarios = await Simulation.find().sort({ createdAt: -1 });
    res.status(200).json({ data: scenarios });
  } catch (error) {
    next(error);
  }
};
