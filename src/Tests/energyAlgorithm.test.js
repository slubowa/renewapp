import db from '../backend/database';
import energyAlgorithm, {
  fetchUserDataById,
  calculateDailyEnergyUsage,
  estimateSystemComponents,
} from '../backend/energyAlgorithm';

jest.mock('../backend/database', () => ({
  query: jest.fn()
}));

describe('Energy Algorithm Module', () => {
  // Tests for fetchUserDataById
  describe('fetchUserDataById', () => {
    it('should fetch user data correctly when provided a valid user ID', async () => {
      const mockUserData = {
        user_id: '123',
        number_of_bulbs: 5,
        bulbWattage: 10,
        hoursPerDayBulbs: 4,
        ownsTV: true,
        televisionSize: '21-44',
        hoursPerDayTV: 2,
        ownsFridge: true,
        fridgeSize: 'medium'
      };
      db.query.mockResolvedValue({ rows: [mockUserData] });

      const userData = await fetchUserDataById('123');
      expect(userData).toEqual(mockUserData);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM energy_consumption WHERE user_id = $1', ['123']);
    });

    it('should throw an error when user data is not found', async () => {
      db.query.mockResolvedValue({ rows: [] });
      await expect(fetchUserDataById('invalid-id')).rejects.toThrow('User data not found.');
    });
  });

  // Tests for calculateDailyEnergyUsage
  describe('calculateDailyEnergyUsage', () => {
    it('calculates correct daily energy usage from given inputs', () => {
      const inputs = {
        numberOfBulbs: 10,
        bulbWattage: 10,
        hoursPerDayBulbs: 5,
        ownsTV: true,
        televisionSize: '21-44',
        hoursPerDayTV: 4,
        ownsFridge: true,
        fridgeSize: 'medium'
      };
      const result = calculateDailyEnergyUsage(inputs);
      expect(result).toBeCloseTo(4.212); 
    });
  });

  // Tests for estimateSystemComponents
  describe('estimateSystemComponents', () => {
    it('estimates system components correctly based on daily energy', () => {
      const dailyEnergy = 10;  // Example daily energy in kWh
      const result = estimateSystemComponents(dailyEnergy);
      expect(result.panelsNeeded).toBeGreaterThan(0);
      expect(result.batteriesNeeded).toBeGreaterThan(0);
      expect(result.inverterRating).toBeGreaterThan(0);
    });
  });

  // Integration Tests for energyAlgorithm
  describe('energyAlgorithm', () => {
    it('integrates subfunctions correctly and returns expected results', async () => {
      const mockUserData = { user_id: '123', number_of_bulbs: 5 };
      db.query.mockImplementation(async (sql) => {
        if (sql.includes('SELECT * FROM energy_consumption')) {
          return { rows: [mockUserData] };
        } else if (sql.includes('INSERT INTO system_recommendation')) {
          return { rows: [{ user_id: '123', panels: 10, batteries: 5, inverter_size: 500 }] };
        }
      });

      const results = await energyAlgorithm('123');
      expect(results).toHaveProperty('panels');
      expect(results).toHaveProperty('batteries');
      expect(results).toHaveProperty('inverter_size');
      expect(db.query).toHaveBeenCalled();
    });
  });
});
