# Quick Start Script for Drug Interaction System
# This script starts all services in Kubernetes

Write-Host "`n🚀 Starting Drug Interaction System..." -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Check if namespace exists, create if not
Write-Host "📦 Checking namespace..." -ForegroundColor Yellow
$namespaceExists = kubectl get namespace drug-interaction-system 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating namespace..." -ForegroundColor Yellow
    kubectl create namespace drug-interaction-system
} else {
    Write-Host "✅ Namespace exists" -ForegroundColor Green
}

# Apply all Kubernetes manifests
Write-Host "`n📋 Applying Kubernetes manifests..." -ForegroundColor Yellow
kubectl apply -f k8s/ -n drug-interaction-system

# Wait for deployments to be ready
Write-Host "`n⏳ Waiting for services to start (this may take 1-2 minutes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check deployment status
Write-Host "`n📊 Checking deployment status..." -ForegroundColor Yellow
kubectl get deployments -n drug-interaction-system

Write-Host "`n⏳ Waiting for pods to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/eureka-server -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/drug-database-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/interaction-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/prescription-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n drug-interaction-system

Write-Host "`n✅ All services are starting!" -ForegroundColor Green
Write-Host "`n📊 Current pod status:" -ForegroundColor Cyan
kubectl get pods -n drug-interaction-system

Write-Host "`n🌐 To access the application:" -ForegroundColor Yellow
Write-Host "   1. Frontend: kubectl port-forward -n drug-interaction-system service/frontend 8081:80" -ForegroundColor White
Write-Host "   2. Eureka Dashboard: kubectl port-forward -n drug-interaction-system service/eureka-server 8761:8761" -ForegroundColor White
Write-Host "`n   Then open:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:8081" -ForegroundColor White
Write-Host "   - Eureka: http://localhost:8761" -ForegroundColor White

Write-Host "`n💡 Tip: Run port-forward commands in separate terminal windows" -ForegroundColor Cyan
Write-Host "`n✨ Done! Services are starting up..." -ForegroundColor Green



