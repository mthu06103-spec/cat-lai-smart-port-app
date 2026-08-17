/**
 * Discrete Event Simulation (DES) Engine
 * Simulates port operations with real-world events
 */

const logger = require('../../utils/logger');

class DESEngine {
  constructor(parameters = {}) {
    this.currentTime = 0;
    this.maxTime = parameters.duration || 86400000; // 24 hours default
    this.tickInterval = parameters.tickInterval || 100; // 100ms tick
    this.events = [];
    this.results = {
      totalMoves: 0,
      totalEnergy: 0,
      averageTurnaroundTime: 0,
      vesselsProcessed: 0,
      containersHandled: 0,
    };
  }

  /**
   * Add event to simulation queue
   */
  addEvent(eventType, eventTime, handler) {
    this.events.push({
      type: eventType,
      time: eventTime,
      handler,
    });
    this.events.sort((a, b) => a.time - b.time);
  }

  /**
   * Run simulation
   */
  async run() {
    logger.info('Starting DES simulation');
    
    while (this.currentTime < this.maxTime && this.events.length > 0) {
      const event = this.events.shift();
      
      if (event.time > this.maxTime) break;
      
      this.currentTime = event.time;
      
      // Execute event handler
      await event.handler(this);
    }
    
    logger.info('DES simulation completed');
    return this.results;
  }

  /**
   * Simulate vessel arrival
   */
  vesselArrival(vessel) {
    logger.info(`Vessel arrived: ${vessel.vesselName}`);
    this.results.vesselsProcessed++;
    
    // Schedule loading/unloading
    const serviceTime = vessel.containerCount / 35; // 35 moves/hour
    this.addEvent('vessel-service-start', this.currentTime, async (engine) => {
      engine.vesselService(vessel, serviceTime);
    });
    
    // Schedule departure
    this.addEvent('vessel-departure', this.currentTime + (serviceTime * 3600000), async (engine) => {
      logger.info(`Vessel departed: ${vessel.vesselName}`);
    });
  }

  /**
   * Simulate vessel service (loading/unloading)
   */
  vesselService(vessel, serviceTime) {
    this.results.containersHandled += vessel.containerCount;
    this.results.totalMoves += vessel.containerCount * 1.5; // 1.5 moves per container
    
    // Energy consumption: ~150 kWh per move for cranes
    this.results.totalEnergy += this.results.totalMoves * 150;
  }

  /**
   * Simulate equipment operation
   */
  equipmentMove(equipment) {
    this.results.totalMoves++;
    
    // Energy consumption based on equipment type
    const energyConsumption = {
      'QC': 200,      // Quay Crane
      'RTG': 100,     // Rubber Tire Gantry
      'STS': 250,     // Ship-to-Shore
      'Reach Stacker': 50,
      'Truck': 30,
    };
    
    this.results.totalEnergy += energyConsumption[equipment.equipmentType] || 100;
  }

  /**
   * Get simulation metrics
   */
  getMetrics() {
    const avgTurnaround = this.results.containersHandled > 0 
      ? (this.currentTime / this.results.vesselsProcessed / 3600000).toFixed(2) 
      : 0;
    
    return {
      ...this.results,
      averageTurnaroundTime: avgTurnaround + ' hours',
      totalSimulationTime: (this.currentTime / 3600000).toFixed(2) + ' hours',
      totalEnergyConsumption: this.results.totalEnergy + ' kWh',
    };
  }
}

/**
 * Run simulation with given parameters
 */
exports.runSimulation = async (parameters) => {
  const engine = new DESEngine(parameters);
  
  // Generate sample events
  const vesselCount = parameters.vesselCount || 5;
  for (let i = 0; i < vesselCount; i++) {
    const arrivalTime = Math.random() * engine.maxTime;
    engine.addEvent('vessel-arrival', arrivalTime, async (engine) => {
      const vessel = {
        vesselName: `Vessel-${i}`,
        containerCount: Math.floor(Math.random() * 1000) + 500,
      };
      engine.vesselArrival(vessel);
    });
  }
  
  // Run simulation
  await engine.run();
  
  // Return metrics
  return engine.getMetrics();
};

module.exports = new DESEngine();
