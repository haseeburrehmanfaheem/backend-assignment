provider "google" {
  project = "assignment-project-455221"
  region  = "us-central1"
}

resource "google_pubsub_topic" "metrics" {
  name = "metrics-topic"
}

resource "google_bigquery_dataset" "metrics" {
  dataset_id = "metrics_dataset"
  location   = "US"
}

resource "google_bigquery_table" "raw_metrics" {
  dataset_id = google_bigquery_dataset.metrics.dataset_id
  table_id   = "raw_metrics"
  schema     = <<EOF
  [
    { "name": "timestamp", "type": "TIMESTAMP" },
    { "name": "latency", "type": "FLOAT64" },
    { "name": "cpu", "type": "FLOAT64" }
  ]
  EOF
}

resource "google_cloud_run_service" "metrics_api" {
  name     = "metrics-api"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/assignment-project-455221/cloud-run-source-deploy/metrics-api:latest"
      }
    }
  }
}
