# Fix: Interaction & Prescription Service Errors

## Issues Fixed

1. ✅ **"Failed to analyze interaction"** - Improved error messages
2. ✅ **"Failed to load data in prescription management"** - Better error handling

## Common Causes & Solutions

### Issue 1: Interaction Service Cannot Reach Drug Database Service

**Symptoms:**
- "Failed to analyze interaction" error
- Interaction Service is running but can't fetch drug data

**Root Cause:**
- Interaction Service depends on Drug Database Service
- If Drug Database Service is down or not registered with Eureka, Interaction Service fails

**Solution:**
1. **Check Eureka Dashboard**: `http://localhost:8761`
   - Verify both services are registered:
     - `drug-database-service` (Port 9001)
     - `interaction-service` (Port 9002)

2. **Start Services in Order**:
   ```
   1. Eureka Server (Port 8761)
   2. Drug Database Service (Port 9001) - Wait 10 seconds
   3. Interaction Service (Port 9002) - Wait 10 seconds
   4. Prescription Service (Port 9003)
   ```

3. **Verify Drug Database Service**:
   - Test: `http://localhost:9001/drugs`
   - Should return JSON array of drugs
   - If empty, load sample data: `POST http://localhost:9001/data/load-sample`

4. **Check Interaction Service Logs**:
   - Look for Feign client errors
   - Check if it can discover `drug-database-service` via Eureka

### Issue 2: Prescription Service Cannot Load Data

**Symptoms:**
- "Failed to load data" error
- Prescriptions page shows empty

**Root Cause:**
- Prescription Service needs both:
  - Drug Database Service (for drug names)
  - Its own database (for prescriptions)

**Solution:**
1. **Check All Services Are Running**:
   - Drug Database Service (Port 9001)
   - Prescription Service (Port 9003)

2. **Test Each Service**:
   ```bash
   # Test Drug Database Service
   curl http://localhost:9001/drugs
   
   # Test Prescription Service
   curl http://localhost:9003/prescriptions
   ```

3. **Check Prescription Service Logs**:
   - Look for Feign client errors
   - Check if it can discover `drug-database-service` via Eureka

### Issue 3: Eureka Service Discovery Issues

**Symptoms:**
- Services are running but can't find each other
- Feign client errors in logs

**Solution:**
1. **Verify Eureka Server is Running**:
   - Open: `http://localhost:8761`
   - Should see all services registered

2. **Check Service Registration**:
   - Each service should show in Eureka dashboard
   - Status should be "UP"

3. **Restart Services**:
   - Stop all services
   - Start Eureka Server first
   - Wait 10 seconds
   - Start other services one by one

## Step-by-Step Troubleshooting

### Step 1: Verify All Services Are Running

**In IntelliJ Console, check for:**
- ✅ Eureka Server: "Started EurekaServerApplication"
- ✅ Drug Database Service: "Drug Database Service is running..."
- ✅ Interaction Service: "Interaction Service is running..."
- ✅ Prescription Service: "Prescription Service running..."

### Step 2: Check Eureka Registration

1. Open: `http://localhost:8761`
2. Look for registered services:
   - `DRUG-DATABASE-SERVICE`
   - `INTERACTION-SERVICE`
   - `PRESCRIPTION-SERVICE`
3. All should show status "UP"

### Step 3: Test Services Directly

**Test Drug Database Service:**
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:9001/drugs" -Method GET
```

**Test Interaction Service:**
```bash
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:9002/health" -Method GET

# Test analysis (requires drugs in database)
Invoke-WebRequest -Uri "http://localhost:9002/interactions/analyze?drugA=1&drugB=2" -Method GET
```

**Test Prescription Service:**
```bash
Invoke-WebRequest -Uri "http://localhost:9003/prescriptions" -Method GET
```

### Step 4: Check Service Dependencies

**Interaction Service needs:**
- ✅ Drug Database Service running
- ✅ Registered with Eureka
- ✅ Has drugs in database

**Prescription Service needs:**
- ✅ Drug Database Service running
- ✅ Interaction Service running (for validation)
- ✅ Both registered with Eureka

### Step 5: Check Logs for Errors

**In IntelliJ Console, look for:**
- ❌ Feign client errors
- ❌ Service discovery errors
- ❌ Connection refused errors
- ❌ Timeout errors

## Improved Error Messages

The frontend now shows specific error messages:

### Interaction Analysis Errors:
- "Cannot connect to Interaction Service (Port 9002)..." - Service not running
- "Server error in Interaction Service. It may not be able to reach Drug Database Service." - Dependency issue
- "Request timed out. Interaction Service may be slow or Drug Database Service is not responding." - Timeout

### Prescription Loading Errors:
- "Cannot connect to Prescription Service (Port 9003)..." - Service not running
- "Cannot connect to Drug Database Service (Port 9001)..." - Dependency issue
- "Cannot connect to Prescription Service (Port 9003) and Drug Database Service (Port 9001)..." - Both down

## Quick Fix Checklist

- [ ] All 4 services are running (Eureka + 3 microservices)
- [ ] Eureka dashboard shows all services registered
- [ ] Drug Database Service has drugs (check `/drugs/count`)
- [ ] Test each service directly via browser/curl
- [ ] Check IntelliJ console for errors
- [ ] Restart services in correct order if needed

## Service Startup Order (IMPORTANT)

```
1. Eureka Server (Port 8761)
   ↓ Wait 10 seconds
2. Drug Database Service (Port 9001)
   ↓ Wait 10 seconds (for Eureka registration)
3. Interaction Service (Port 9002)
   ↓ Wait 10 seconds
4. Prescription Service (Port 9003)
```

**Why this order?**
- Eureka must be first (service discovery)
- Drug Database Service must be before Interaction Service (dependency)
- All services need time to register with Eureka

## Testing After Fix

1. **Test Interaction Analysis**:
   - Go to Interactions page
   - Select two drugs
   - Click "Analyze Interaction"
   - Should show results or specific error message

2. **Test Prescription Loading**:
   - Go to Prescriptions page
   - Should load prescriptions and drugs
   - Or show specific error about which service failed

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Console tab for detailed errors
   - Check Network tab for failed requests

## Still Not Working?

1. **Check CORS Configuration**:
   - Verify CORS config files exist in all services
   - Restart services after adding CORS config

2. **Check Port Conflicts**:
   ```powershell
   netstat -ano | findstr :9001
   netstat -ano | findstr :9002
   netstat -ano | findstr :9003
   ```

3. **Check Firewall**:
   - Ensure ports 9001, 9002, 9003 are not blocked

4. **Rebuild Services**:
   ```bash
   # In each service directory
   mvn clean install
   ```

5. **Check Application Logs**:
   - Look for stack traces in IntelliJ console
   - Check for database connection errors
   - Check for Feign client configuration errors

---

**The improved error messages will now tell you exactly which service is failing!**











