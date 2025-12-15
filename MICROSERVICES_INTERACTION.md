# Microservices Interaction Architecture

## Overview

This document explains how the three microservices interact with each other in the Drug Interaction System. The system uses **Spring Cloud** with **Eureka Service Discovery** and **OpenFeign** for inter-service communication.

---

## Architecture Components

### 1. **Eureka Server** (Port 8761)
- **Role**: Service Discovery and Registry
- **Function**: Maintains a registry of all available microservices
- **Status**: All services register themselves with Eureka on startup

### 2. **Drug Database Service** (Port 9001)
- **Role**: Master drug data repository
- **Database**: H2 in-memory database
- **Responsibilities**:
  - CRUD operations for drugs
  - Stores drug information (name, category, dosage, side effects)
- **Dependencies**: None (it's the base service)

### 3. **Interaction Service** (Port 9002)
- **Role**: Drug interaction analysis engine
- **Responsibilities**:
  - Analyzes interactions between two drugs
  - Applies business rules (category conflicts, side effect overlap, dosage checks)
  - Calculates risk levels and severity scores
- **Dependencies**: 
  - **Calls**: Drug Database Service (via Feign Client)

### 4. **Prescription Service** (Port 9003)
- **Role**: Prescription management and validation
- **Database**: H2 in-memory database
- **Responsibilities**:
  - Manages prescriptions (patient, doctor, medications)
  - Validates drug interactions in prescriptions
  - Generates interaction summaries
- **Dependencies**:
  - **Calls**: Drug Database Service (via Feign Client)
  - **Calls**: Interaction Service (via Feign Client)

---

## Service Discovery (Eureka)

### How It Works:

1. **Eureka Server** runs on port 8761
2. Each microservice registers itself with Eureka on startup:
   ```java
   @EnableEurekaClient  // or @EnableDiscoveryClient
   ```
3. Services discover each other by **service name** (not hardcoded URLs):
   - `drug-database-service`
   - `interaction-service`
   - `prescription-service`

### Configuration:
```yaml
# Each service's application.yml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

**Benefits**:
- Services don't need to know exact IPs/ports
- Load balancing (if multiple instances)
- Health monitoring
- Automatic failover

---

## Inter-Service Communication: OpenFeign

### What is Feign?

**OpenFeign** is a declarative HTTP client that makes it easy to call other microservices. Instead of writing REST template code, you define an interface, and Feign handles the HTTP calls.

### How Feign Works:

1. **Define an Interface** with Spring annotations:
   ```java
   @FeignClient(name = "drug-database-service")
   public interface DrugClient {
       @GetMapping("/drugs/{id}")
       DrugDTO getDrug(@PathVariable("id") Long id);
   }
   ```

2. **Feign automatically**:
   - Discovers the service via Eureka
   - Makes HTTP REST calls
   - Handles serialization/deserialization
   - Implements fallback mechanisms (if configured)

---

## Interaction Flows

### Flow 1: Frontend → Interaction Service → Drug Database Service

**Scenario**: User wants to analyze interaction between two drugs

```
┌─────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │ HTTP GET
       │ /interactions/analyze?drugA=1&drugB=2
       ▼
┌─────────────────────┐
│ Interaction Service │
│   (Port 9002)        │
└──────┬──────────────┘
       │
       │ Feign Client Call
       │ drugClient.getDrug(1)
       │ drugClient.getDrug(2)
       ▼
┌──────────────────────┐
│ Drug Database Service│
│    (Port 9001)       │
│                      │
│ Returns:             │
│ - Drug 1 details     │
│ - Drug 2 details     │
└──────────────────────┘
       │
       │ Returns DrugDTO objects
       ▼
┌─────────────────────┐
│ Interaction Service │
│                     │
│ 1. Receives drugs    │
│ 2. RuleEngine        │
│    evaluates rules   │
│ 3. Calculates score  │
│ 4. Determines risk   │
└──────┬──────────────┘
       │
       │ Returns InteractionResultDTO
       ▼
┌─────────────┐
│   Frontend  │
│  Displays   │
│  Results    │
└─────────────┘
```

**Code Flow**:
```java
// InteractionService.analyze()
1. drugClient.getDrug(idA) → Calls Drug Database Service
2. drugClient.getDrug(idB) → Calls Drug Database Service
3. ruleEngine.evaluateRules(drug1, drug2) → Local processing
4. Calculate severity score
5. Return InteractionResultDTO
```

---

### Flow 2: Frontend → Prescription Service → Multiple Services

**Scenario**: User creates a prescription with multiple drugs

```
┌─────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │ HTTP POST
       │ /prescriptions
       │ { patientName, doctorName, items: [...] }
       ▼
┌──────────────────────┐
│ Prescription Service │
│    (Port 9003)       │
└──────┬───────────────┘
       │
       │ For each drug pair:
       │
       ├─► Feign: drugClient.getDrug(id)
       │   └─► Drug Database Service (Port 9001)
       │
       └─► Feign: interactionClient.analyze(idA, idB)
           └─► Interaction Service (Port 9002)
               └─► Which calls Drug Database Service
                   └─► Returns analysis
       │
       │ Builds interaction summary
       │ Saves prescription to DB
       ▼
┌──────────────────────┐
│ Prescription Service │
│ Returns prescription  │
│ with summary          │
└──────────────────────┘
       │
       ▼
┌─────────────┐
│   Frontend  │
│  Displays   │
│ Prescription│
└─────────────┘
```

**Code Flow**:
```java
// PrescriptionService.createPrescription()
1. For each pair of drugs in prescription:
   a. drugClient.getDrug(drugIdA) → Get drug details
   b. drugClient.getDrug(drugIdB) → Get drug details
   c. interactionClient.analyze(drugIdA, drugIdB) → Analyze interaction
      (This internally calls Drug Database Service again)
   
2. Build interaction summary string
3. Save prescription with summary to local database
4. Return prescription
```

**Example**: Prescription with 3 drugs (A, B, C)
- Analyzes: A↔B, A↔C, B↔C (3 pairs)
- Makes 6 calls to Drug Database Service (2 per pair)
- Makes 3 calls to Interaction Service (1 per pair)

---

## Detailed Service Interactions

### 1. Interaction Service → Drug Database Service

**Feign Client** (`InteractionService/DrugClient.java`):
```java
@FeignClient(name = "drug-database-service")
public interface DrugClient {
    @GetMapping("/drugs/{id}")
    DrugDTO getDrug(@PathVariable("id") Long id);
    
    @GetMapping("/drugs")
    List<DrugDTO> getAllDrugs();
}
```

**Usage** (`InteractionEngine.java`):
```java
public InteractionResultDTO analyze(Long idA, Long idB) {
    // Feign automatically discovers "drug-database-service" via Eureka
    DrugDTO d1 = drugClient.getDrug(idA);  // HTTP GET to port 9001
    DrugDTO d2 = drugClient.getDrug(idB);  // HTTP GET to port 9001
    
    // Local processing
    List<InteractionRule> rules = ruleEngine.evaluateRules(d1, d2);
    int score = ScoringUtils.calculateSeverity(rules);
    
    return result;
}
```

**What Happens**:
1. Feign looks up `drug-database-service` in Eureka registry
2. Gets the actual URL (e.g., `http://localhost:9001`)
3. Makes HTTP GET request: `GET http://localhost:9001/drugs/1`
4. Deserializes JSON response to `DrugDTO`
5. Returns the object

---

### 2. Prescription Service → Drug Database Service

**Feign Client** (`PrescriptionService/DrugClient.java`):
```java
@FeignClient(
    name = "drug-database-service",
    fallback = DrugClientFallback.class  // Error handling
)
public interface DrugClient {
    @GetMapping("/drugs/{id}")
    DrugDTO getDrug(@PathVariable("id") Long id);
}
```

**Usage** (`PrescriptionService.java`):
```java
private String computeInteractionSummary(List<PrescriptionItem> items) {
    for (each drug pair) {
        // Get drug names for display
        DrugDTO da = drugClient.getDrug(itemA.getDrugId());
        DrugDTO db = drugClient.getDrug(itemB.getDrugId());
        
        // Use names in summary
        String nameA = da.getName();
        String nameB = db.getName();
    }
}
```

**Fallback Mechanism**:
If Drug Database Service is down, `DrugClientFallback` is called:
```java
@Component
public class DrugClientFallback implements DrugClient {
    @Override
    public DrugDTO getDrug(Long id) {
        DrugDTO d = new DrugDTO();
        d.setId(id);
        d.setName("UNKNOWN");  // Graceful degradation
        return d;
    }
}
```

---

### 3. Prescription Service → Interaction Service

**Feign Client** (`PrescriptionService/InteractionClient.java`):
```java
@FeignClient(
    name = "interaction-service",
    fallback = InteractionClientFallback.class
)
public interface InteractionClient {
    @GetMapping("/interactions/analyze")
    InteractionResultDTO analyze(
        @RequestParam("drugA") Long drugA,
        @RequestParam("drugB") Long drugB
    );
}
```

**Usage** (`PrescriptionService.java`):
```java
// For each drug pair in prescription
InteractionResultDTO res = interactionClient.analyze(
    itemA.getDrugId(),
    itemB.getDrugId()
);

// Build summary
summary += nameA + " <-> " + nameB + 
           " => risk=" + res.getRiskLevel() + 
           " score=" + res.getSeverityScore();
```

**What Happens**:
1. Feign discovers `interaction-service` via Eureka
2. Makes HTTP GET: `GET /interactions/analyze?drugA=1&drugB=2`
3. Interaction Service internally calls Drug Database Service
4. Returns `InteractionResultDTO` with risk analysis
5. Prescription Service uses this to build summary

**Fallback**:
```java
@Component
public class InteractionClientFallback implements InteractionClient {
    @Override
    public InteractionResultDTO analyze(Long drugA, Long drugB) {
        InteractionResultDTO r = new InteractionResultDTO();
        r.setRiskLevel(RiskLevel.MODERATE);
        r.setMessage("Interaction service unavailable (fallback).");
        return r;
    }
}
```

---

## Complete Request Flow Example

### Example: Create Prescription with 2 Drugs

**User Action**: Create prescription with Drug ID 1 and Drug ID 2

```
Step 1: Frontend → Prescription Service
POST http://localhost:9003/prescriptions
{
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "items": [
    { "drugId": 1, "doseMg": 500 },
    { "drugId": 2, "doseMg": 400 }
  ]
}

Step 2: Prescription Service → Drug Database Service (2 calls)
GET http://localhost:9001/drugs/1  → Returns Drug 1 details
GET http://localhost:9001/drugs/2  → Returns Drug 2 details

Step 3: Prescription Service → Interaction Service
GET http://localhost:9002/interactions/analyze?drugA=1&drugB=2

Step 4: Interaction Service → Drug Database Service (2 calls)
GET http://localhost:9001/drugs/1  → Gets Drug 1 for analysis
GET http://localhost:9001/drugs/2  → Gets Drug 2 for analysis

Step 5: Interaction Service (Local Processing)
- RuleEngine evaluates rules
- Calculates severity score
- Determines risk level
- Returns InteractionResultDTO

Step 6: Prescription Service (Local Processing)
- Receives interaction result
- Builds summary: "Paracetamol <-> Ibuprofen => risk=MODERATE score=45"
- Saves prescription to database
- Returns prescription with summary

Step 7: Frontend receives response
{
  "id": 1,
  "patientName": "John Doe",
  "interactionSummary": "Paracetamol <-> Ibuprofen => risk=MODERATE score=45"
}
```

**Total API Calls**:
- 4 calls to Drug Database Service (2 from Prescription Service, 2 from Interaction Service)
- 1 call to Interaction Service
- 1 call from Frontend to Prescription Service

---

## Key Technologies

### 1. **Eureka Service Discovery**
- **Purpose**: Services find each other dynamically
- **How**: Each service registers with Eureka on startup
- **Benefit**: No hardcoded URLs, automatic load balancing

### 2. **OpenFeign**
- **Purpose**: Declarative HTTP client for microservices
- **How**: Define interface, Feign handles HTTP calls
- **Benefit**: Clean code, automatic service discovery, fallback support

### 3. **Fallback Pattern**
- **Purpose**: Graceful degradation when services are down
- **How**: Implement fallback class, Feign calls it on failure
- **Benefit**: System continues working even if one service fails

---

## Service Dependencies Graph

```
                    ┌─────────────────┐
                    │  Eureka Server  │
                    │   (Port 8761)   │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ Drug Database    │  │ Interaction │  │ Prescription     │
    │ Service          │  │ Service      │  │ Service          │
    │ (Port 9001)      │  │ (Port 9002)  │  │ (Port 9003)      │
    │                  │  │              │  │                  │
    │ - No dependencies│  │ - Depends on │  │ - Depends on     │
    │ - Base service   │  │   Drug DB    │  │   Drug DB       │
    │                  │  │              │  │   Interaction   │
    └──────────────────┘  └──────┬───────┘  └────────┬─────────┘
                                 │                    │
                                 │                    │
                    ┌────────────┴────────────┐       │
                    │                         │       │
                    │  Feign Client Calls     │       │
                    │  (via Eureka discovery)  │       │
                    │                         │       │
                    └─────────────────────────┘       │
                                                       │
                                    ┌──────────────────┘
                                    │
                                    │ Feign Client Calls
                                    │ (via Eureka discovery)
                                    │
```

---

## Error Handling & Resilience

### 1. **Try-Catch in Interaction Service**
```java
try {
    d1 = drugClient.getDrug(idA);
} catch (Exception ex) {
    d1 = null;  // Handle gracefully
}
```

### 2. **Feign Fallback Classes**
- Automatically called when service is unavailable
- Returns default/fallback values
- System continues operating

### 3. **Null Checks**
- Services check for null responses
- Provide meaningful error messages
- Don't crash the system

---

## Benefits of This Architecture

1. **Separation of Concerns**: Each service has a single responsibility
2. **Scalability**: Services can be scaled independently
3. **Resilience**: Fallback mechanisms prevent cascading failures
4. **Service Discovery**: No hardcoded URLs, easy deployment
5. **Loose Coupling**: Services communicate via well-defined interfaces
6. **Testability**: Each service can be tested independently

---

## Summary

1. **Eureka** enables service discovery (services find each other)
2. **Feign** makes inter-service calls simple (declarative HTTP client)
3. **Interaction Service** depends on **Drug Database Service** for drug data
4. **Prescription Service** depends on both **Drug Database Service** and **Interaction Service**
5. **Fallback mechanisms** ensure graceful degradation
6. All communication happens via **REST APIs** over HTTP
7. Services are **loosely coupled** and can be deployed independently

The architecture follows microservices best practices with proper service discovery, declarative clients, and resilience patterns.











