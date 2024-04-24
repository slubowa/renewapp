import db from '../backend/database'; 
import costProjection, { LowestEquipmentCost } from '../backend/costProjection';

jest.mock('../backend/database', () => ({
  query: jest.fn()
}));

describe('Cost Projection Module', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('LowestEquipmentCost', () => {
    it('returns the lowest cost for specified equipment', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ lowest_cost: "150" }]
      });
      const cost = await LowestEquipmentCost('panel', '300W');
      expect(cost).toBe(150);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['panel', '300W']);
    });

    it('returns 0 if no cost is found', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });
      const cost = await LowestEquipmentCost('battery', '100Ah');
      expect(cost).toBe(0);
    });
  });

  describe('costProjection Function', () => {
    it('successfully calculates cost projections', async () => {
      db.query.mockImplementation((sql, params) => {
        if (sql.includes('FROM energy_consumption')) {
          return Promise.resolve({
            rows: [{ average_monthly_consumption: 100, grid_cost_unit: 0.1 }]
          });
        } else if (sql.includes('FROM system_recommendation')) {
          return Promise.resolve({
            rows: [{ panels: 10, batteries: 5, inverter_size: 500 }]
          });
        } else if (sql.includes('FROM supplier_products')) {
          return Promise.resolve({
            rows: [{ lowest_cost: "200" }] 
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const result = await costProjection(1);
      expect(result).toBeDefined();
      expect(result.solarCosts.length).toBe(7);
      expect(result.gridCosts.length).toBe(7);
    });

    it('throws an error if user consumption data is not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(costProjection(1)).rejects.toThrow("User consumption data not found.");
    });

    it('throws an error if system recommendations are not found', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ average_monthly_consumption: 100, grid_cost_unit: 0.1 }] })
        .mockResolvedValueOnce({ rows: [] });

      await expect(costProjection(1)).rejects.toThrow("System recommendation not found.");
    });
  });
});
