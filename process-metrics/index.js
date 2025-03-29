const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.processMetrics = async (message, context) => {
  const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
  await bigquery
    .dataset('metrics_dataset')
    .table('raw_metrics')
    .insert([data]);
};