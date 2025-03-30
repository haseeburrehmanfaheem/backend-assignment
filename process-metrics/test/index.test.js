const { processMetrics } = require('../index');
const { BigQuery } = require('@google-cloud/bigquery');
const MockDate = require('mockdate');

jest.mock('@google-cloud/bigquery', () => {
  const mockInsert = jest.fn().mockResolvedValue([]);
  const mockTable = jest.fn().mockReturnValue({ insert: mockInsert });
  const mockDataset = jest.fn().mockReturnValue({ table: mockTable });
  return {
    BigQuery: jest.fn(() => ({
      dataset: mockDataset,
    })),
    // Expose mocks for assertions
    mockInsert,
    mockDataset,
    mockTable,
  };
});

const { mockInsert, mockDataset, mockTable } = require('@google-cloud/bigquery');


describe('Cloud Function Unit Tests', () => {
  beforeEach(() => {
    MockDate.set('2024-05-30T00:00:00Z'); // Freeze time for consistent timestamp in tests
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });

  // Test valid message
  it('should process a valid Pub/Sub message', async () => {
    const testData = { timestamp: 1717027200, latency: 45.2, cpu: 80.5 };
    const message = {
      data: Buffer.from(JSON.stringify(testData)).toString('base64')
    };
  
    await processMetrics(message);
  
    // Verify the BigQuery method calls
    expect(mockDataset).toHaveBeenCalledWith('metrics_dataset');
    expect(mockTable).toHaveBeenCalledWith('raw_metrics');
    expect(mockInsert).toHaveBeenCalledWith([{
      timestamp: new Date(1717027200 * 1000),
      latency: 45.2,
      cpu: 80.5
    }]);
  });

  // Test invalid message
  it('should reject malformed JSON', async () => {
    const message = { data: Buffer.from('invalid_json').toString('base64') };
    await expect(processMetrics(message)).rejects.toThrow(SyntaxError);
  });
});
