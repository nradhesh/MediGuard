# Frontend Backend Connectivity - Troubleshooting Guide

## Current Status ✅

All services are **RUNNING** and **HEALTHY**:
- ✅ Eureka Server (1/1 Running)
- ✅ Drug Database Service (1/1 Running)  
- ✅ Interaction Service (1/1 Running)
- ✅ Prescription Service (1/1 Running)
- ✅ Frontend (1/1 Running)

## Verified Working

✅ **Nginx proxy is working** - Tested from inside frontend pod:
- `/api/drugs` → Returns drug data
- `/api/prescriptions` → Returns prescription data  
- `/api/interactions/analyze` → Returns interaction analysis

✅ **All backend services are accessible** via Kubernetes DNS

## If Frontend Still Shows "Failed to load dashboard statistics"

### Step 1: Hard Refresh Browser
- **Windows/Linux:** Press `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac:** Press `Cmd + Shift + R`

This clears the browser cache and loads the new frontend code.

### Step 2: Check Browser Console
1. Open **DevTools** (Press `F12`)
2. Go to **Console** tab
3. Look for any **red error messages**
4. Share the exact error if you see any

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Refresh the page
3. Look for requests to `/api/drugs`, `/api/prescriptions`
4. Check their **Status**:
   - ✅ **200** = Success
   - ❌ **404** = Not found
   - ❌ **500** = Server error
   - ❌ **CORS error** = Cross-origin issue
   - ❌ **Failed/Blocked** = Network issue

### Step 4: Verify Port Forward
Make sure port-forward is running:
```powershell
kubectl port-forward -n drug-interaction-system service/frontend 8081:80
```

If it's not running, start it in a separate terminal window.

### Step 5: Test Direct API Access
Open these URLs directly in your browser (should return JSON):
- http://localhost:8081/api/drugs
- http://localhost:8081/api/prescriptions
- http://localhost:8081/api/interactions/analyze?drugA=1&drugB=2

If these work but the frontend doesn't, it's a JavaScript/caching issue.

## Common Issues & Solutions

### Issue: "Failed to load dashboard statistics"
**Solution:** Hard refresh browser (Ctrl+F5)

### Issue: CORS errors in console
**Solution:** Already fixed - CORS is configured on all backend services

### Issue: 404 errors for API calls
**Solution:** Check nginx logs:
```powershell
kubectl logs -n drug-interaction-system deployment/frontend
```

### Issue: Network errors
**Solution:** Verify port-forward is running and services are up:
```powershell
kubectl get pods -n drug-interaction-system
kubectl get svc -n drug-interaction-system
```

## Quick Test Commands

Test from inside frontend pod:
```powershell
kubectl exec -n drug-interaction-system deployment/frontend -- wget -qO- http://localhost/api/drugs
```

Test backend service directly:
```powershell
kubectl exec -n drug-interaction-system deployment/frontend -- wget -qO- http://drug-database-service.drug-interaction-system.svc.cluster.local:9001/drugs
```

## Still Not Working?

If after hard refresh you still see errors, please provide:
1. **Browser Console errors** (exact error message)
2. **Network tab** - Status codes of failed requests
3. **Screenshot** of the error if possible



