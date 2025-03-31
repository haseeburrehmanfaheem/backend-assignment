# Real-Time Metrics Pipeline with BigQuery ML

## Setup Instructions (GCP)
1. **Prerequisites**:  
   - GCP Project ID: `assignment-project-455221`  
   - Enable APIs: Cloud Run, Pub/Sub, BigQuery, Cloud Functions.  
   - Install [gcloud CLI](https://cloud.google.com/sdk/docs/install).  

2. **Deployment**:  
   - **Terraform**:  
     ```bash
     cd terraform
     terraform init && terraform apply -auto-approve
     ```  
   - **Manual Deployment**:  
     - Deploy Cloud Run:  
       ```bash
       gcloud run deploy metrics-api --source=. --region=us-central1
       ```  
     - Deploy Cloud Function:  
       ```bash
       gcloud functions deploy process-metrics --trigger-topic=metrics-topic --runtime=nodejs18 --region=us-central1
       ```  

3. **Usage**:  
   - **Ingest Metrics**:  
     ```bash
     curl -X POST -H "Content-Type: application/json" \
       -d '{"timestamp": 1717027200, "latency": 45.2, "cpu": 80.5}' \
       https://metrics-api-1002594367103.us-central1.run.app/metrics
     ```  
   - **Fetch Anomalies**:  
     ```bash
     curl https://metrics-api-1002594367103.us-central1.run.app/anomalies
     ```  

4. **Alternates Used**:  
   - Pub/Sub: Default (no Redis alternate).  
   - BigQuery ML: ARIMA_PLUS (no local scikit-learn).  

5. **Monitoring**:  
   - Latency alert policy: `latency-policy.yaml`.
