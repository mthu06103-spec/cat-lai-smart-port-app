const Vessel = require('../models/Vessel');
const logger = require('../utils/logger');

/**
 * Get all vessels
 */
exports.getAllVessels = async (req, res, next) => {
  try {
    const vessels = await Vessel.find().sort({ arrivalTime: -1 });
    res.status(200).json({ data: vessels });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vessel details
 */
exports.getVesselDetails = async (req, res, next) => {
  try {
    const vessel = await Vessel.findById(req.params.vesselId).populate('containers');
    if (!vessel) {
      return res.status(404).json({ error: 'Vessel not found' });
    }
    res.status(200).json({ data: vessel });
  } catch (error) {
    next(error);
  }
};

/**
 * Register new vessel arrival
 */
exports.registerVessel = async (req, res, next) => {
  try {
    const { vesselName, imo, arrivalTime, containerCount, weight } = req.body;

    const vessel = new Vessel({
      vesselName,
      imo,
      arrivalTime,
      containerCount,
      weight,
      status: 'arrived',
      createdAt: new Date(),
    });

    await vessel.save();

    logger.info(`Vessel registered: ${vessel._id} - ${vesselName}`);

    res.status(201).json({
      success: true,
      data: vessel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update vessel status
 */
exports.updateVesselStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const vessel = await Vessel.findByIdAndUpdate(
      req.params.vesselId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!vessel) {
      return res.status(404).json({ error: 'Vessel not found' });
    }
    res.status(200).json({ data: vessel });
  } catch (error) {
    next(error);
  }
};
