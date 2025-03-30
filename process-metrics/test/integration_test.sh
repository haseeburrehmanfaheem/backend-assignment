#!/bin/bash
gcloud pubsub topics publish metrics-topic --message='{"timestamp":1717027200,"latency":45.2,"cpu":80.5}' \
  --format=json
echo "Waiting 120 seconds for data to land in BigQuery..."
sleep 120
RESULT=$(bq query --nouse_legacy_sql --format=json \
  "SELECT COUNT(*) as count FROM \`assignment-project-455221.metrics_dataset.raw_metrics\` \
   WHERE latency = 45.2" 2>&1)
echo "Raw BigQuery result: $RESULT"
COUNT=$(echo "$RESULT" | jq -r '.[0].count')
if [[ "$COUNT" -ge 1 ]]; then
  echo "✅ Integration test passed: Found $COUNT matching rows"
  exit 0
else
  echo "❌ Integration test failed: 0 matching rows found"
  exit 1
fi