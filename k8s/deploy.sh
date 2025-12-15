#!/bin/bash

# Script to deploy all services to Kubernetes
set -e

echo "Building Docker images..."

# Build images from project root (required for common-utils dependency)
docker build -f eureka-server/Dockerfile -t eureka-server:latest .
docker build -f drug-database-service/Dockerfile -t drug-database-service:latest .
docker build -f interaction-service/Dockerfile -t interaction-service:latest .
docker build -f prescription-service/Dockerfile -t prescription-service:latest .

# Build frontend with production environment variables
cd medicare-connect-main
docker build --build-arg VITE_DRUG_SERVICE_URL=/api/drugs --build-arg VITE_INTERACTION_SERVICE_URL=/api/interactions --build-arg VITE_PRESCRIPTION_SERVICE_URL=/api/prescriptions -f Dockerfile -t frontend:latest .
cd ..

echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Applying ConfigMaps..."
kubectl apply -f k8s/configmap-eureka.yaml
kubectl apply -f k8s/configmap-drug-db.yaml
kubectl apply -f k8s/configmap-interaction.yaml
kubectl apply -f k8s/configmap-prescription.yaml
kubectl apply -f k8s/configmap-frontend.yaml

echo "Deploying Eureka Server..."
kubectl apply -f k8s/deployment-eureka.yaml
kubectl apply -f k8s/service-eureka.yaml

echo "Waiting for Eureka Server to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/eureka-server -n drug-interaction-system

echo "Deploying Drug Database Service..."
kubectl apply -f k8s/deployment-drug-db.yaml
kubectl apply -f k8s/service-drug-db.yaml

echo "Deploying Interaction Service..."
kubectl apply -f k8s/deployment-interaction.yaml
kubectl apply -f k8s/service-interaction.yaml

echo "Deploying Prescription Service..."
kubectl apply -f k8s/deployment-prescription.yaml
kubectl apply -f k8s/service-prescription.yaml

echo "Deploying Frontend..."
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

echo "Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "Deployment complete!"
echo ""
echo "To check status, run:"
echo "  kubectl get pods -n drug-interaction-system"
echo "  kubectl get services -n drug-interaction-system"
echo ""
echo "To access services:"
echo "  Frontend: http://localhost (via ingress)"
echo "  Eureka: http://localhost/eureka"
echo "  Or use port-forward: kubectl port-forward -n drug-interaction-system service/frontend 8080:80"

