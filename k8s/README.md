# Kubernetes Deployment Guide

This directory contains Kubernetes manifests to deploy all services in the drug-interaction-system.

## Prerequisites

1. **Kubernetes cluster** (minikube, kind, or cloud-based)
2. **kubectl** configured to connect to your cluster
3. **Docker** for building images
4. **Maven** for building Java services
5. **Node.js** for building frontend (if needed)

## Architecture

The deployment includes:
- **Eureka Server** (port 8761) - Service discovery
- **Drug Database Service** (port 9001) - Drug management
- **Interaction Service** (port 9002) - Drug interaction analysis
- **Prescription Service** (port 9003) - Prescription management
- **Frontend** (port 80) - React application

## Quick Start

### Option 1: Using Deployment Scripts

**Linux/Mac:**
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

**Windows (PowerShell):**
```powershell
.\k8s\deploy.ps1
```

### Option 2: Manual Deployment

1. **Build Docker images from project root:**
   ```bash
   # Build all services (build context must be project root for common-utils dependency)
   docker build -f eureka-server/Dockerfile -t eureka-server:latest .
   docker build -f drug-database-service/Dockerfile -t drug-database-service:latest .
   docker build -f interaction-service/Dockerfile -t interaction-service:latest .
   docker build -f prescription-service/Dockerfile -t prescription-service:latest .
   
   # Build frontend with production API URLs
   cd medicare-connect-main
   docker build --build-arg VITE_DRUG_SERVICE_URL=/api/drugs --build-arg VITE_INTERACTION_SERVICE_URL=/api/interactions --build-arg VITE_PRESCRIPTION_SERVICE_URL=/api/prescriptions -f Dockerfile -t frontend:latest .
   cd ..
   ```

2. **Load images into your cluster** (if using minikube/kind):
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

3. **Deploy to Kubernetes:**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml
   
   # Apply ConfigMaps
   kubectl apply -f k8s/configmap-*.yaml
   
   # Deploy Eureka first (other services depend on it)
   kubectl apply -f k8s/deployment-eureka.yaml
   kubectl apply -f k8s/service-eureka.yaml
   
   # Wait for Eureka to be ready
   kubectl wait --for=condition=available --timeout=300s deployment/eureka-server -n drug-interaction-system
   
   # Deploy other services
   kubectl apply -f k8s/deployment-drug-db.yaml
   kubectl apply -f k8s/service-drug-db.yaml
   
   kubectl apply -f k8s/deployment-interaction.yaml
   kubectl apply -f k8s/service-interaction.yaml
   
   kubectl apply -f k8s/deployment-prescription.yaml
   kubectl apply -f k8s/service-prescription.yaml
   
   kubectl apply -f k8s/deployment-frontend.yaml
   kubectl apply -f k8s/service-frontend.yaml
   
   # Deploy Ingress
   kubectl apply -f k8s/ingress.yaml
   ```

## Accessing Services

### Using Ingress (if enabled)

If you have an ingress controller installed (e.g., NGINX Ingress):
- Frontend: http://localhost
- Eureka Dashboard: http://localhost/eureka
- APIs: http://localhost/api/drugs, http://localhost/api/interactions, etc.

### Using Port Forwarding

```bash
# Frontend
kubectl port-forward -n drug-interaction-system service/frontend 8080:80

# Eureka Server
kubectl port-forward -n drug-interaction-system service/eureka-server 8761:8761

# Drug Database Service
kubectl port-forward -n drug-interaction-system service/drug-database-service 9001:9001

# Interaction Service
kubectl port-forward -n drug-interaction-system service/interaction-service 9002:9002

# Prescription Service
kubectl port-forward -n drug-interaction-system service/prescription-service 9003:9003
```

### Using NodePort (Alternative)

You can modify the service files to use NodePort type instead of ClusterIP for external access.

## Monitoring

Check deployment status:
```bash
# View all pods
kubectl get pods -n drug-interaction-system

# View all services
kubectl get services -n drug-interaction-system

# View logs
kubectl logs -n drug-interaction-system deployment/eureka-server
kubectl logs -n drug-interaction-system deployment/drug-database-service
kubectl logs -n drug-interaction-system deployment/interaction-service
kubectl logs -n drug-interaction-system deployment/prescription-service
kubectl logs -n drug-interaction-system deployment/frontend

# Describe a pod for troubleshooting
kubectl describe pod <pod-name> -n drug-interaction-system
```

## Scaling Services

To scale a service:
```bash
kubectl scale deployment/drug-database-service --replicas=3 -n drug-interaction-system
```

## Updating Services

1. Rebuild the Docker image
2. Update the image in the cluster (or use image pull policy)
3. Restart the deployment:
   ```bash
   kubectl rollout restart deployment/<service-name> -n drug-interaction-system
   ```

## Cleanup

To remove all resources:
```bash
kubectl delete namespace drug-interaction-system
```

Or delete individual resources:
```bash
kubectl delete -f k8s/
```

## Troubleshooting

1. **Pods not starting:**
   - Check pod logs: `kubectl logs <pod-name> -n drug-interaction-system`
   - Check pod status: `kubectl describe pod <pod-name> -n drug-interaction-system`

2. **Services not connecting:**
   - Verify Eureka is running first
   - Check service endpoints: `kubectl get endpoints -n drug-interaction-system`
   - Verify DNS resolution within the cluster

3. **Image pull errors:**
   - Ensure images are built and available
   - For local clusters, load images using `minikube image load` or `kind load docker-image`

4. **Ingress not working:**
   - Verify ingress controller is installed
   - Check ingress status: `kubectl get ingress -n drug-interaction-system`
   - Review ingress controller logs

## Notes

- Services use H2 in-memory databases, so data is not persisted across pod restarts
- For production, consider using persistent volumes for databases
- The frontend API URLs need to be updated to use Kubernetes service names instead of localhost
- Consider adding resource limits and requests for production deployments

