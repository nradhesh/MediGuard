# Fix: Prescription Service Connection Error

## Error Message
"Cannot connect to Prescription Service (Port 9003). Please ensure the service is running."

## Quick Diagnosis

### Step 1: Check if Service is Running

**In IntelliJ:**
1. Look at the **Run** tab or **Console** window
2. Check if you see: `"Prescription Service running..."`
3. If you don't see this message, the service is **not running**

**Check Running Applications:**
- Look for `PrescriptionServiceApplication` in IntelliJ's run configurations
- Should show as "Running" with a green play icon

### Step 2: Test Service Directly

**Open in Browser:**
```
http://localhost:9003/health
```

**Expected Response:**
```
Prescription Service: OK
```

**If you get:**
- ❌ "This site can't be reached" → Service is not running
- ❌ "Connection refused" → Service is not running
- ❌ "404 Not Found" → Service is running but endpoint wrong
- ✅ "Prescription Service: OK" → Service is working!

### Step 3: Check Port 9003 is Available

**In PowerShell:**
```powershell
netstat -ano | findstr :9003
```

**If port is in use:**
- You'll see a process ID (PID)
- Find what's using it: `tasklist | findstr <PID>`
- Stop that process or change the port in `application.yml`

## Solutions

### Solution 1: Start the Service

**In IntelliJ:**
1. Find `PrescriptionServiceApplication.java`
2. Right-click → **Run 'PrescriptionServiceApplication'**
3. Wait for: `"Prescription Service running..."`
4. Check console for any errors

**Check for Errors:**
- ❌ Port already in use
- ❌ Database connection failed
- ❌ Eureka connection failed
- ❌ Missing dependencies

### Solution 2: Rebuild and Restart

**If CORS config was just added:**
1. **Stop** the service (if running)
2. **Rebuild** the project:
   ```bash
   cd prescription-service
   mvn clean compile
   ```
3. **Start** the service again
4. **Wait 10-15 seconds** for startup

### Solution 3: Check Service Dependencies

**Prescription Service needs:**
1. ✅ **Eureka Server** (Port 8761) - Must be running first
2. ✅ **Drug Database Service** (Port 9001) - For drug names
3. ✅ **Interaction Service** (Port 9002) - For interaction analysis

**Start Order:**
```
1. Eureka Server (Port 8761)
   ↓ Wait 10 seconds
2. Drug Database Service (Port 9001)
   ↓ Wait 10 seconds
3. Interaction Service (Port 9002)
   ↓ Wait 10 seconds
4. Prescription Service (Port 9003) ← This one!
```

### Solution 4: Check Eureka Registration

**Open Eureka Dashboard:**
```
http://localhost:8761
```

**Look for:**
- `PRESCRIPTION-SERVICE` in the list
- Status should be **UP**
- If not listed → Service didn't register (check logs)

**If not registered:**
- Check Eureka URL in `application.yml`: `http://localhost:8761/eureka/`
- Check if Eureka Server is running
- Restart Prescription Service

### Solution 5: Check Console Logs

**Look for these messages:**
```
✅ "Prescription Service running..."
✅ "Started PrescriptionServiceApplication"
✅ Service registration messages
```

**Look for errors:**
```
❌ "Port 9003 is already in use"
❌ "Connection refused to Eureka"
❌ "Failed to start application"
❌ Any stack traces or exceptions
```

## Common Issues

### Issue 1: Port Already in Use

**Error:** `Port 9003 is already in use`

**Solution:**
1. Find what's using port 9003:
   ```powershell
   netstat -ano | findstr :9003
   ```
2. Kill the process or change port in `application.yml`:
   ```yaml
   server:
     port: 9004  # Change to different port
   ```

### Issue 2: Service Crashes on Startup

**Check IntelliJ Console for:**
- Database connection errors
- Missing dependency errors
- Configuration errors

**Common causes:**
- H2 database initialization failed
- Missing Feign client configuration
- Eureka connection failed

**Solution:**
- Check all dependencies in `pom.xml`
- Verify `application.yml` is correct
- Check if Eureka Server is running

### Issue 3: CORS Not Working

**If service is running but frontend can't connect:**

1. **Verify CORS config exists:**
   - File: `prescription-service/src/main/java/com/example/prescription/config/CorsConfig.java`
   - Should have `@Configuration` and `CorsFilter` bean

2. **Rebuild and restart:**
   ```bash
   mvn clean install
   ```

3. **Test CORS:**
   - Open browser DevTools (F12)
   - Check Network tab
   - Look for CORS errors in console

### Issue 4: Service Not Registered with Eureka

**Symptoms:**
- Service is running
- But not visible in Eureka dashboard
- Other services can't find it

**Solution:**
1. Check `application.yml`:
   ```yaml
   eureka:
     client:
       serviceUrl:
         defaultZone: http://localhost:8761/eureka/
   ```

2. Verify Eureka Server is running
3. Restart Prescription Service
4. Wait 30 seconds for registration

## Step-by-Step Fix

### Complete Reset (Recommended)

1. **Stop ALL services** in IntelliJ

2. **Start in order:**
   ```
   a. Eureka Server
   b. Wait 10 seconds
   c. Drug Database Service
   d. Wait 10 seconds
   e. Interaction Service
   f. Wait 10 seconds
   g. Prescription Service ← Start this last
   ```

3. **Verify each service:**
   - Eureka: `http://localhost:8761`
   - Drug DB: `http://localhost:9001/health` (if exists) or `/drugs`
   - Interaction: `http://localhost:9002/health`
   - Prescription: `http://localhost:9003/health` ← Test this!

4. **Check Eureka Dashboard:**
   - All 3 services should be registered
   - All should show status "UP"

5. **Test Frontend:**
   - Refresh Prescriptions page
   - Should now connect successfully

## Quick Test Commands

**Test Prescription Service:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:9003/health" -Method GET

# Get all prescriptions
Invoke-WebRequest -Uri "http://localhost:9003/prescriptions" -Method GET
```

**Expected Response:**
- Health: `"Prescription Service: OK"`
- Prescriptions: `[]` (empty array if no prescriptions)

## Verification Checklist

- [ ] Prescription Service is running in IntelliJ
- [ ] Console shows: "Prescription Service running..."
- [ ] `http://localhost:9003/health` returns "OK"
- [ ] Service is registered in Eureka (`http://localhost:8761`)
- [ ] No errors in IntelliJ console
- [ ] Port 9003 is not blocked by firewall
- [ ] CORS config is compiled and loaded
- [ ] All dependencies are satisfied

## Still Not Working?

### Check These:

1. **Java Version:**
   - Service requires Java 17
   - Check: `java -version`

2. **Maven Dependencies:**
   ```bash
   cd prescription-service
   mvn dependency:tree
   ```
   - Should show all dependencies resolved

3. **Build Errors:**
   ```bash
   mvn clean compile
   ```
   - Should compile without errors

4. **Check IntelliJ Run Configuration:**
   - Main class: `com.example.prescription.PrescriptionServiceApplication`
   - Working directory: `prescription-service`
   - JRE: Java 17

5. **Check Application Logs:**
   - Look for full stack traces
   - Check for database errors
   - Check for network errors

---

## Quick Fix Summary

**Most Common Issue:** Service is simply not running.

**Quick Fix:**
1. Find `PrescriptionServiceApplication.java` in IntelliJ
2. Right-click → **Run**
3. Wait for "Prescription Service running..."
4. Test: `http://localhost:9003/health`
5. Refresh frontend

**If still not working:**
- Check IntelliJ console for errors
- Verify Eureka Server is running
- Check port 9003 is not in use
- Rebuild project: `mvn clean install`











