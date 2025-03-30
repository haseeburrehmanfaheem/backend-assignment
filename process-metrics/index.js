const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.processMetrics = async (message, context) => {
  // Parse ONCE: message.data is base64 → decode → JSON
  const metrics = JSON.parse(Buffer.from(message.data, 'base64').toString());
  
  // Convert timestamp (assuming it's in seconds)
  metrics.timestamp = new Date(metrics.timestamp * 1000); 
  
  // Insert to BigQuery
  await bigquery
    .dataset('metrics_dataset')
    .table('raw_metrics')
    .insert([metrics]);
};