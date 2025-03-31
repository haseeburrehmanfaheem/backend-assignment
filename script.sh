#!/bin/bash

# Generate valid test data
for i in {1..50}; do
  timestamp=$(date +%s)  # Current timestamp
  latency=$((40 + RANDOM % 100))
  cpu=$((70 + RANDOM % 30))

  curl -X POST -H "Content-Type: application/json" \
    -d "{\"timestamp\": $timestamp, \"latency\": $latency, \"cpu\": $cpu}" \
    https://metrics-api-1002594367103.us-central1.run.app/metrics

  sleep 1  # Avoid flooding the API
done