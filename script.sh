for i in {0..49}
do
  timestamp=$(date -u -d "$i days ago" +%s)
  latency=$(awk -v min=30 -v max=100 'BEGIN{srand(); print min+rand()*(max-min)}')
  cpu=$(awk -v min=10 -v max=90 'BEGIN{srand(); print min+rand()*(max-min)}')

  curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"timestamp\": $timestamp, \"latency\": $latency, \"cpu\": $cpu}" \
    https://metrics-api-1002594367103.us-central1.run.app/metrics

  echo "[$i] Sent → timestamp: $timestamp | latency: $latency | cpu: $cpu"
  sleep 0.5
done
