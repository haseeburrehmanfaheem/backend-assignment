const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const app = express();
const pubsub = new PubSub();
app.use(express.json());
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery(); // Initialize BigQuery client

app.post('/metrics', async (req, res) => {
  const { timestamp, latency, cpu } = req.body;

  if (!timestamp || !latency || !cpu) {
    return res.status(400).send('Invalid input, missing required fields');
  }

  try {
    const topic = pubsub.topic('metrics-topic');
    await topic.publishMessage({ json: req.body });
    res.status(200).send('Metrics received');
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).send('Failed to publish metrics');
  }
});



// NEW GET /anomalies endpoint
app.get('/anomalies', async (req, res) => {
  try {
    const query = `
      SELECT minute_timestamp, latency, is_anomaly
      FROM \`metrics_dataset.anomalies_table\`
      ORDER BY minute_timestamp DESC
      LIMIT 100
    `;
    const [rows] = await bigquery.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('BigQuery Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch anomalies' });
  }
});


app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port 8080');
});