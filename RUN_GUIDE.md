# How to Run the Drug Interaction System

This project consists of multiple microservices (Backend) and a Frontend application. Follow the steps below to run the entire system locally.

## Prerequisites
- **Java JDK 17** or higher
- **Maven** (Apache Maven)
- **Node.js** (v18+ recommended) and **npm**

## Architecture Overview
- **Eureka Server** (Port 8761): Service Registry
- **Drug Database Service** (Port 9001): Manages drug data
- **Interaction Service** (Port 9002): Analyzes drug interactions
- **Prescription Service** (Port 9003): Manages prescriptions
- **Frontend** (Port 8080): React/Vite application

---

## Step 1: Start the Backend Microservices

You need to start the services in the following order. Open a separate terminal window for each service.

### 1. Eureka Server (Service Discovery)
This must be started first so other services can register.
```bash
cd eureka-server
mvn spring-boot:run
```
*Wait until you see "Started EurekaServerApplication" in the logs before proceeding.*
*Verify: Open http://localhost:8761 in your browser.*

### 2. Drug Database Service
```bash
cd drug-database-service
mvn spring-boot:run
```

### 3. Interaction Service
```bash
cd interaction-service
mvn spring-boot:run
```

### 4. Prescription Service
```bash
cd prescription-service
mvn spring-boot:run
```

---

## Step 2: Start the Frontend Application

Open a new terminal window for the frontend.

```bash
cd medicare-connect-main
npm install
npm run dev
```

The application will start at **http://localhost:8080**.

## Troubleshooting
- **Port Conflicts**: Ensure ports 8761, 9001, 9002, 9003, and 8080 are free.
- **Service Discovery**: If services usually fail to connect, ensure Eureka (Step 1) is fully running before starting others.
- **Database**: The services use H2 in-memory databases by default, so no external database setup is required (based on documentation).
