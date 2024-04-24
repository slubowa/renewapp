/**
 * This function calculates the cost projection for a user's energy consumption.
 * It compares the cost of using a recommended solar system against the grid power over a set period.
 * The costs are calculated based on the user's energy consumption data and system recommendations.
 */

import db from "./database.js";


export const LowestEquipmentCost = async (type, specification) => {
  if (!specification) return 0;

  const query = `
    SELECT MIN(unit_cost) AS lowest_cost
    FROM supplier_products
    WHERE equipment_type = $1 AND ${type}_specification = $2;
  `;
  const result = await db.query(query, [type, specification]);
  console.log('result:',result)
  return result.rows.length ? parseFloat(result.rows[0].lowest_cost) : 0;
};

const costProjection = async (userId) => {
  try {
    // Retrieve user's consumption data
    const consumptionResult = await db.query(
      'SELECT * FROM energy_consumption WHERE user_id = $1',
      [userId]
    );
    const userConsumption = consumptionResult.rows[0];
    if (!userConsumption) {
      throw new Error("User consumption data not found.");
    }
    // Retrieve system recommendation results
    const recommendationResult = await db.query(
      'SELECT * FROM system_recommendation WHERE user_id = $1',
      [userId]
    );
    const recommendation = recommendationResult.rows[0];
    console.log('recommendation:',recommendation)
    if (!recommendation) {
      throw new Error("System recommendation not found.");
    }

    //equipment costs
    
    const [panelCost, batteryCost, inverterCost] = await Promise.all([
      LowestEquipmentCost('panel', '300W'),
      LowestEquipmentCost('battery', '100Ah'),
      LowestEquipmentCost('inverter', (recommendation.inverter_size <= 500 ?('500w')
      : recommendation.inverter_size <= 1000 ?('1000w')
      : ('1500W')))
      
    ]);
     console.log('panelCost,batteryCost,inverterCost',panelCost,batteryCost,inverterCost);
  
    // Calculate the total cost of the recommended solar system
    let solarSystemCost = (recommendation.panels * panelCost||0)
    + (recommendation.batteries * batteryCost||0)
    + (inverterCost||0);
    
    console.log(solarSystemCost);
    // Calculate grid power cost over 5 years
    const gridCostPerYear = (userConsumption.average_monthly_consumption || 93) * 12 * (userConsumption.grid_cost_unit || 0.2);
    const gridCosts = Array.from({ length: 7 }, (_, index) => gridCostPerYear * (index + 1));


    console.log(gridCosts);

    // Assuming the operational cost of solar is negligible over 5 years
    const solarCosts = [ ...Array.from({ length:7 }, () => solarSystemCost)];

    console.log(solarCosts);

    return { solarCosts, gridCosts };

  } catch (error) {
    console.error('Error in costProjection:', error.message);
    throw error; // Rethrow the error to handle it in the route that calls this function
  }
};

export default costProjection;
