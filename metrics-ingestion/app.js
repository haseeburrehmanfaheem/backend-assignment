const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const app = express();
const pubsub = new PubSub();
app.use(express.json());

app.post('/metrics', async (req, res) => {
  const topic = pubsub.topic('metrics-topic');
  await topic.publishMessage({ json: req.body });
  res.status(200).send('Metrics received');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port 8080');
});