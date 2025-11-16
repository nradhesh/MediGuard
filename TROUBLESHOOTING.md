# Troubleshooting Guide: "Failed to load drugs"

## Quick Checks

### 1. Verify Backend Services Are Running

**Check in IntelliJ:**
- ✅ Eureka Server (Port 8761) - Should show "Started EurekaServerApplication"
- ✅ Drug Database Service (Port 9001) - Should show "Drug Database Service is running..."
- ✅ Interaction Service (Port 9002) - Should show "Interaction Service is running..."
- ✅ Prescription Service (Port 9003) - Should show "Prescription Service running..."

**Quick Test:**
Open your browser and navigate to:
- `http://localhost:9001/drugs` - Should return JSON array of drugs
- `http://localhost:8761` - Should show Eureka dashboard with registered services

### 2. Check CORS Configuration

**Issue**: CORS config might not be compiled or loaded.

**Solution**:
1. **Rebuild the project** in IntelliJ:
   - Right-click on `drug-database-service` → Maven → Reload Project
   - Right-click on project → Maven → Rebuild
   - Or use: `mvn clean install` in terminal

2. **Restart the service** after rebuilding:
   - Stop the Drug Database Service
   - Start it again

3. **Verify CORS config exists**:
   - File: `drug-database-service/src/main/java/com/example/drugdb/config/CorsConfig.java`
   - Should contain `@Configuration` and `CorsFilter` bean

### 3. Check Browser Console

**Open Browser DevTools (F12)** and check:

1. **Console Tab**: Look for error messages
   - CORS errors: "Access to XMLHttpRequest blocked by CORS policy"
   - Network errors: "Failed to fetch" or "ERR_CONNECTION_REFUSED"
   - Timeout errors: "timeout of 10000ms exceeded"

2. **Network Tab**:
   - Look for request to `http://localhost:9001/drugs`
   - Check the status code:
     - **200**: Success (but might be CORS issue)
     - **404**: Service not found
     - **500**: Server error
     - **CORS error**: Red request with CORS error message
   - Check Response headers for CORS headers:
     - `Access-Control-Allow-Origin: *`
     - `Access-Control-Allow-Methods: *`

### 4. Verify Service Ports

**Check if ports are in use:**
```bash
# Windows PowerShell
netstat -ano | findstr :9001
netstat -ano | findstr :9002
netstat -ano | findstr :9003
netstat -ano | findstr :8761
```

**If port is in use by another process:**
- Stop the other process
- Or change the port in `application.yml`

### 5. Test API Directly

**Using curl (PowerShell):**
```powershell
# Test Drug Database Service
curl http://localhost:9001/drugs

# Test with headers (simulating browser)
curl -H "Origin: http://localhost:5173" http://localhost:9001/drugs
```

**Using Postman or Browser:**
- Navigate to: `http://localhost:9001/drugs`
- Should see JSON response with drug array

### 6. Check Application Logs

**In IntelliJ Console**, look for:
- ✅ "Drug Database Service is running..."
- ✅ "Sample drugs inserted."
- ❌ Any error messages or exceptions

**Common errors:**
- Port already in use
- Database connection failed
- CORS filter not found

## Common Issues & Solutions

### Issue 1: CORS Error
**Error Message**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Ensure `CorsConfig.java` exists in `drug-database-service/src/main/java/com/example/drugdb/config/`
2. Rebuild the project: `mvn clean install`
3. Restart the Drug Database Service
4. Verify CORS config is loaded (check logs)

**Alternative**: If CORS still doesn't work, add `@CrossOrigin` to controller:
```java
@RestController
@RequestMapping("/drugs")
@CrossOrigin(origins = "*")
public class DrugController {
    // ...
}
```

### Issue 2: Connection Refused
**Error Message**: "ECONNREFUSED" or "Failed to fetch"

**Solution**:
1. Verify service is running on port 9001
2. Check firewall settings
3. Try accessing `http://localhost:9001/drugs` directly in browser
4. Check if service crashed (look at IntelliJ console)

### Issue 3: Service Not Registered with Eureka
**Error Message**: Service discovery issues

**Solution**:
1. Ensure Eureka Server is running first (Port 8761)
2. Check Eureka dashboard: `http://localhost:8761`
3. Verify service is registered (should see "drug-database-service")
4. Check `application.yml` has correct Eureka configuration

### Issue 4: Timeout Error
**Error Message**: "timeout of 10000ms exceeded"

**Solution**:
1. Service might be slow to respond
2. Increase timeout in `api.ts`:
   ```typescript
   const apiClient = axios.create({
     timeout: 30000, // 30 seconds
   });
   ```

### Issue 5: 404 Not Found
**Error Message**: "404 Not Found"

**Solution**:
1. Verify endpoint URL: `http://localhost:9001/drugs`
2. Check controller mapping: `@RequestMapping("/drugs")`
3. Ensure service is running on correct port

### Issue 6: 500 Internal Server Error
**Error Message**: "500 Internal Server Error"

**Solution**:
1. Check IntelliJ console for stack trace
2. Common causes:
   - Database connection issue
   - Null pointer exception
   - Missing dependency
3. Check application logs for detailed error

## Step-by-Step Fix

### Step 1: Restart All Services
1. Stop all Spring Boot services in IntelliJ
2. Start Eureka Server first
3. Wait 10 seconds
4. Start Drug Database Service
5. Wait for "Drug Database Service is running..."
6. Start other services

### Step 2: Rebuild CORS Configuration
```bash
# In drug-database-service directory
mvn clean compile
```

### Step 3: Verify CORS is Working
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the Drugs page
4. Click on the request to `localhost:9001/drugs`
5. Check Response Headers:
   - Should see `Access-Control-Allow-Origin: *`

### Step 4: Test Direct API Call
Open browser and go to: `http://localhost:9001/drugs`
- Should see JSON array
- If you see CORS error in console but JSON in response, CORS is the issue

## Quick Fix Script

If you're still having issues, try this:

1. **Stop all services**
2. **Clean and rebuild**:
   ```bash
   cd drug-database-service
   mvn clean install
   ```
3. **Restart services** in this order:
   - Eureka Server
   - Drug Database Service
   - Interaction Service
   - Prescription Service
4. **Wait 30 seconds** for all services to start
5. **Test**: `http://localhost:9001/drugs` in browser
6. **Refresh frontend**

## Still Not Working?

### Enable Detailed Logging

Add to `drug-database-service/src/main/resources/application.yml`:
```yaml
logging:
  level:
    com.example.drugdb: DEBUG
    org.springframework.web.cors: DEBUG
```

### Check CORS Filter is Active

Add a test endpoint to verify CORS:
```java
@GetMapping("/test")
@CrossOrigin(origins = "*")
public String test() {
    return "CORS is working!";
}
```

Then test: `http://localhost:9001/test`

### Verify Frontend URL

Check if frontend is running on expected port:
- Default Vite port: `5173`
- Check `vite.config.ts` for custom port
- Ensure CORS allows your frontend origin

## Contact Points

If issue persists:
1. Check IntelliJ console for full error stack trace
2. Check browser console for detailed error
3. Check Network tab for request/response details
4. Verify all services are running and registered with Eureka


