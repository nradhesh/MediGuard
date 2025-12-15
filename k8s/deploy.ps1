# PowerShell script to deploy all services to Kubernetes
$ErrorActionPreference = "Stop"

Write-Host "Building Docker images..." -ForegroundColor Green

# Build images from project root (required for common-utils dependency)
Write-Host "Building Eureka Server..." -ForegroundColor Yellow
docker build -f eureka-server/Dockerfile -t eureka-server:latest .

Write-Host "Building Drug Database Service..." -ForegroundColor Yellow
docker build -f drug-database-service/Dockerfile -t drug-database-service:latest .

Write-Host "Building Interaction Service..." -ForegroundColor Yellow
docker build -f interaction-service/Dockerfile -t interaction-service:latest .

Write-Host "Building Prescription Service..." -ForegroundColor Yellow
docker build -f prescription-service/Dockerfile -t prescription-service:latest .

Write-Host "Building Frontend..." -ForegroundColor Yellow
Set-Location medicare-connect-main
docker build --build-arg VITE_DRUG_SERVICE_URL=/api/drugs --build-arg VITE_INTERACTION_SERVICE_URL=/api/interactions --build-arg VITE_PRESCRIPTION_SERVICE_URL=/api/prescriptions -f Dockerfile -t frontend:latest .
Set-Location ..

Write-Host "Creating namespace..." -ForegroundColor Green
kubectl apply -f k8s/namespace.yaml

Write-Host "Applying ConfigMaps..." -ForegroundColor Green
kubectl apply -f k8s/configmap-eureka.yaml
kubectl apply -f k8s/configmap-drug-db.yaml
kubectl apply -f k8s/configmap-interaction.yaml
kubectl apply -f k8s/configmap-prescription.yaml
kubectl apply -f k8s/configmap-frontend.yaml

Write-Host "Deploying Eureka Server..." -ForegroundColor Green
kubectl apply -f k8s/deployment-eureka.yaml
kubectl apply -f k8s/service-eureka.yaml

Write-Host "Waiting for Eureka Server to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/eureka-server -n drug-interaction-system

Write-Host "Deploying Drug Database Service..." -ForegroundColor Green
kubectl apply -f k8s/deployment-drug-db.yaml
kubectl apply -f k8s/service-drug-db.yaml

Write-Host "Deploying Interaction Service..." -ForegroundColor Green
kubectl apply -f k8s/deployment-interaction.yaml
kubectl apply -f k8s/service-interaction.yaml

Write-Host "Deploying Prescription Service..." -ForegroundColor Green
kubectl apply -f k8s/deployment-prescription.yaml
kubectl apply -f k8s/service-prescription.yaml

Write-Host "Deploying Frontend..." -ForegroundColor Green
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

Write-Host "Deploying Ingress..." -ForegroundColor Green
kubectl apply -f k8s/ingress.yaml

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To check status, run:" -ForegroundColor Cyan
Write-Host "  kubectl get pods -n drug-interaction-system"
Write-Host "  kubectl get services -n drug-interaction-system"
Write-Host ""
Write-Host "To access services:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost (via ingress)"
Write-Host "  Eureka: http://localhost/eureka"
Write-Host "  Or use port-forward: kubectl port-forward -n drug-interaction-system service/frontend 8080:80"

