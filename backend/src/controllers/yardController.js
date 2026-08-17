const Container = require('../models/Container');
const YardBlock = require('../models/YardBlock');
const yardOptimization = require('../services/simulations/yardOptimization');
const logger = require('../utils/logger');

/**
 * Optimize container stacking in yard
 * Reduces container shifters by up to 40%
 */
exports.optimizeYardStacking = async (req, res, next) => {
  try {
    const { containerIds, optimization } = req.body;

    logger.info(`Optimizing yard stacking for ${containerIds.length} containers`);

    const containers = await Container.find({ _id: { $in: containerIds } });
    const yardBlocks = await YardBlock.find();

    // Run stackAI optimization
    const optimizationResult = await yardOptimization.optimizeStacking({
      containers,
      yardBlocks,
      algorithm: optimization || 'greedy',
    });

    res.status(200).json({
      success: true,
      data: {
        optimizedPositions: optimizationResult.positions,
        reducedShifters: optimizationResult.shiftersReduction,
        productivityGain: optimizationResult.productivityGain,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get yard blocks information
 */
exports.getYardBlocks = async (req, res, next) => {
  try {
    const blocks = await YardBlock.find().populate('containers');
    res.status(200).json({ data: blocks });
  } catch (error) {
    next(error);
  }
};

/**
 * Get yard utilization
 */
exports.getYardUtilization = async (req, res, next) => {
  try {
    const blocks = await YardBlock.find();
    const totalCapacity = blocks.reduce((sum, block) => sum + block.capacity, 0);
    const usedCapacity = blocks.reduce((sum, block) => sum + block.containers.length, 0);

    res.status(200).json({
      data: {
        totalCapacity,
        usedCapacity,
        utilizationPercentage: (usedCapacity / totalCapacity * 100).toFixed(2),
        availableSlots: totalCapacity - usedCapacity,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update container position
 */
exports.updateContainerPosition = async (req, res, next) => {
  try {
    const { blockId, position } = req.body;
    const container = await Container.findByIdAndUpdate(
      req.params.containerId,
      { blockId, position, updatedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ data: container });
  } catch (error) {
    next(error);
  }
};

/**
 * Get yard density heatmap
 */
exports.getYardHeatmap = async (req, res, next) => {
  try {
    const blocks = await YardBlock.find().populate('containers');
    const heatmap = blocks.map(block => ({
      blockId: block._id,
      density: block.containers.length / block.capacity,
      containerCount: block.containers.length,
      maxCapacity: block.capacity,
    }));
    res.status(200).json({ data: heatmap });
  } catch (error) {
    next(error);
  }
};
