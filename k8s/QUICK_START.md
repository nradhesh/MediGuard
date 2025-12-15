# Quick Start Guide - Kubernetes Commands

## 🚀 Starting the Application

### Option 1: Using the Start Script (Recommended)
```powershell
.\k8s\start.ps1
```

### Option 2: Manual Commands

#### 1. Create namespace (if not exists)
```powershell
kubectl create namespace drug-interaction-system
```

#### 2. Apply all Kubernetes manifests
```powershell
kubectl apply -f k8s/ -n drug-interaction-system
```

#### 3. Check deployment status
```powershell
kubectl get deployments -n drug-interaction-system
kubectl get pods -n drug-interaction-system
```

#### 4. Wait for services to be ready
```powershell
kubectl wait --for=condition=available --timeout=300s deployment/eureka-server -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/drug-database-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/interaction-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/prescription-service -n drug-interaction-system
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n drug-interaction-system
```

## 🌐 Accessing the Application

### Start Port-Forwarding (run in separate terminals)

**Terminal 1 - Frontend:**
```powershell
kubectl port-forward -n drug-interaction-system service/frontend 8081:80
```

**Terminal 2 - Eureka Dashboard:**
```powershell
kubectl port-forward -n drug-interaction-system service/eureka-server 8761:8761
```

### Access URLs:
- **Frontend:** http://localhost:8081
- **Eureka Dashboard:** http://localhost:8761

## 📊 Useful Commands

### Check pod status
```powershell
kubectl get pods -n drug-interaction-system
```

### View pod logs
```powershell
# Frontend
kubectl logs -n drug-interaction-system deployment/frontend

# Eureka Server
kubectl logs -n drug-interaction-system deployment/eureka-server

# Drug Database Service
kubectl logs -n drug-interaction-system deployment/drug-database-service

# Interaction Service
kubectl logs -n drug-interaction-system deployment/interaction-service

# Prescription Service
kubectl logs -n drug-interaction-system deployment/prescription-service
```

### Restart a service
```powershell
kubectl rollout restart deployment/<service-name> -n drug-interaction-system
```

### Delete everything (cleanup)
```powershell
kubectl delete namespace drug-interaction-system
```

## 🔍 Troubleshooting

### If pods are not starting:
```powershell
# Check pod status
kubectl get pods -n drug-interaction-system

# Check pod events
kubectl describe pod <pod-name> -n drug-interaction-system

# Check logs
kubectl logs <pod-name> -n drug-interaction-system
```

### If services are not accessible:
1. Ensure port-forwarding is running
2. Check if pods are in `Running` state
3. Verify services exist: `kubectl get svc -n drug-interaction-system`

## 📝 Notes

- Services may take 1-2 minutes to fully start
- Eureka Server must start first before other services can register
- If you rebuild Docker images, you may need to restart deployments:
  ```powershell
  kubectl rollout restart deployment/<service-name> -n drug-interaction-system
  ```



