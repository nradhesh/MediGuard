# Quick Start Guide - Kubernetes Deployment

## Prerequisites Check

Before starting, ensure you have:
- ✅ Kubernetes cluster running (minikube, kind, Docker Desktop Kubernetes, or cloud cluster)
- ✅ kubectl configured and connected to your cluster
- ✅ Docker installed and running
- ✅ Maven installed (for building Java services)

## One-Command Deployment

### Windows (PowerShell)
```powershell
.\k8s\deploy.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

## What the Script Does

1. **Builds Docker images** for all services:
   - Eureka Server
   - Drug Database Service
   - Interaction Service
   - Prescription Service
   - Frontend

2. **Creates Kubernetes namespace** (`drug-interaction-system`)

3. **Deploys ConfigMaps** with service configurations

4. **Deploys services in order**:
   - Eureka Server (waits for it to be ready)
   - Other microservices
   - Frontend
   - Ingress

## Accessing Services

### Option 1: Port Forwarding (Recommended for local testing)

```bash
# Frontend
kubectl port-forward -n drug-interaction-system service/frontend 8080:80

# Then access at http://localhost:8080
```

### Option 2: Using Ingress

If you have an ingress controller installed (NGINX Ingress):
- Frontend: http://localhost
- Eureka Dashboard: http://localhost/eureka

### Option 3: Individual Service Port Forwarding

```bash
# Eureka Server
kubectl port-forward -n drug-interaction-system service/eureka-server 8761:8761

# Drug Database Service
kubectl port-forward -n drug-interaction-system service/drug-database-service 9001:9001

# Interaction Service
kubectl port-forward -n drug-interaction-system service/interaction-service 9002:9002

# Prescription Service
kubectl port-forward -n drug-interaction-system service/prescription-service 9003:9003
```

## Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n drug-interaction-system

# Check services
kubectl get services -n drug-interaction-system

# View logs
kubectl logs -n drug-interaction-system deployment/eureka-server
kubectl logs -n drug-interaction-system deployment/frontend
```

## Troubleshooting

### Images not found
If using minikube or kind, load images into the cluster:
```bash
# For minikube
minikube image load eureka-server:latest
minikube image load drug-database-service:latest
minikube image load interaction-service:latest
minikube image load prescription-service:latest
minikube image load frontend:latest

# For kind
kind load docker-image eureka-server:latest
kind load docker-image drug-database-service:latest
kind load docker-image interaction-service:latest
kind load docker-image prescription-service:latest
kind load docker-image frontend:latest
```

### Pods not starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n drug-interaction-system

# Check logs
kubectl logs <pod-name> -n drug-interaction-system
```

### Clean up
```bash
# Delete everything
kubectl delete namespace drug-interaction-system
```

## Next Steps

- Scale services: `kubectl scale deployment/drug-database-service --replicas=3 -n drug-interaction-system`
- Update configurations: Edit ConfigMaps and restart deployments
- Add persistent storage for databases (currently using in-memory H2)






