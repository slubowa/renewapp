import db from "./database.js";


/**
 * This script contains functions to calculate and recommend an energy system configuration.
 * It utilizes user data to estimate the number of solar panels, batteries, and the inverter rating required.
 */

const solarPanelOutputHours = 7;  // Average peak sunlight hours in Uganda
const SOLAR_PANEL_WATTAGE = 300;  // Average wattage per panel in watts
const BATTERY_VOLTAGE = 12;       // Typical battery voltage

// Appliance wattages by size or specification
const fridgeWattages = { small: 100, medium: 150, large: 200 };
const tvWattages = { "<21": 19, "21-44": 28, ">44": 48 };

// Fetch user energy consumption details
export async function fetchUserDataById(userId) {
  try {
    const { rows } = await db.query('SELECT * FROM energy_consumption WHERE user_id = $1', [userId]);

    if (rows.length === 0) {
      throw new Error("User data not found.");
    }
    
    return rows[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;  
  }
}

// Calculate daily energy usage based on user's appliance data
export function calculateDailyEnergyUsage(inputs) {
  const dailyEnergyBulbs = inputs.numberOfBulbs * inputs.bulbWattage * inputs.hoursPerDayBulbs / 1000;
  const dailyEnergyTV = inputs.ownsTV ? (tvWattages[inputs.televisionSize] || 0) * inputs.hoursPerDayTV / 1000 : 0;
  const dailyEnergyFridge = inputs.ownsFridge ? (fridgeWattages[inputs.fridgeSize] || 0) * 24 / 1000 : 0;

  return dailyEnergyBulbs + dailyEnergyTV + dailyEnergyFridge;  // Total daily energy in kWh
}

// Estimate necessary system components based on daily energy usage
export function estimateSystemComponents(dailyEnergy) {
  const dailyEnergyFromOnePanel = SOLAR_PANEL_WATTAGE * solarPanelOutputHours / 1000;
  const panelsNeeded = Math.ceil(dailyEnergy / dailyEnergyFromOnePanel);
  const totalBatteryCapacityNeeded = dailyEnergy * 1.2;
  const batteriesNeeded = Math.ceil(totalBatteryCapacityNeeded * 1000 / (BATTERY_VOLTAGE * 100));
  const inverterRating = Math.ceil(dailyEnergy * 1.5 * 1000);  // Increase max wattage by 50%

  return { panelsNeeded, batteriesNeeded, inverterRating, dailyEnergyRequirement: Math.ceil(dailyEnergy) };
}

// Main function to run energy estimation
async function energyAlgorithm(userId) {
  const userData = await fetchUserDataById(userId);
  if (!userData) {
    console.log("User data not found for ID:", userId);
    return;
  }

  const inputs = {
    numberOfBulbs: userData.number_of_bulbs || 0,
    bulbWattage: 10,  // Default wattage for common solar bulbs
    hoursPerDayBulbs: 5,
    ownsTV: userData.television_size !== null,
    televisionSize: userData.screen_size || "<21",
    hoursPerDayTV: 4,
    ownsFridge: userData.fridge_size !== null,
    fridgeSize: userData.fridge_size || 'small',
  };

  const dailyEnergy = calculateDailyEnergyUsage(inputs);
  const systemComponents = estimateSystemComponents(dailyEnergy);

  try {
    const { rows } = await db.query(
      `INSERT INTO system_recommendation (user_id, daily_energy_requirement, panels, batteries, inverter_size)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        daily_energy_requirement = EXCLUDED.daily_energy_requirement,
        panels = EXCLUDED.panels,
        batteries = EXCLUDED.batteries,
        inverter_size = EXCLUDED.inverter_size
      RETURNING *`,
      [userId, systemComponents.dailyEnergyRequirement, systemComponents.panelsNeeded, systemComponents.batteriesNeeded, systemComponents.inverterRating]
    );
    console.log('Stored Calculation Result:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('Error storing calculation results:', error);
    throw error;
  }
}

export default energyAlgorithm;
