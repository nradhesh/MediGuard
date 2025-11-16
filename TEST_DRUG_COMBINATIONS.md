# Test Drug Combinations - Ready to Use

## Quick Test Cases

### 🔴 CRITICAL Risk Test
**Prescription with 3 Antibiotics:**
```
Drug IDs: 3 (Amoxicillin), 7 (Azithromycin), 9 (Ciprofloxacin)
Risk: HIGH for each pair (same category conflict = 70 points each)
System should flag as multiple high-risk interactions
```

### 🟠 HIGH Risk Test
**Two Antibiotics:**
```
Drug IDs: 3 (Amoxicillin), 7 (Azithromycin)
Risk: 70 points (same category) → HIGH
```

### 🟡 MODERATE Risk Test
**High Dosage Combination:**
```
Drug IDs: 5 (Metformin 500mg), 1 (Paracetamol 500mg), 9 (Ciprofloxacin 500mg)
Note: Each pair = 1000mg exactly (at threshold, safe)
But prescription overall should be reviewed due to multiple drugs
```

**Side Effect Overlap:**
```
Drug IDs: 1 (Paracetamol), 7 (Azithromycin)
Both have "Nausea" → 15 points (SAFE, but demonstrates overlap detection)
```

### 🟢 SAFE Risk Test
**Different Categories, Low Dosage:**
```
Drug IDs: 4 (Cetirizine), 10 (Omeprazole)
Risk: 0 points → SAFE
```

---

## Practical Examples to Try in UI

### Example 1: Critical Alert Scenario
1. Go to **Prescriptions** page
2. Create new prescription:
   - Patient: "John Doe"
   - Doctor: "Dr. Smith"
   - Add drugs: **Amoxicillin, Azithromycin, Ciprofloxacin**
3. **Expected Result:** System should show HIGH risk alerts for all antibiotic pairs

### Example 2: High Risk Warning
1. Go to **Interactions** page
2. Select: **Amoxicillin** ↔ **Azithromycin**
3. **Expected Result:** 
   - Risk Level: HIGH
   - Severity Score: 70
   - Message: "Both drugs are in same category: Antibiotic"

### Example 3: Safe Combination
1. Go to **Interactions** page  
2. Select: **Cetirizine** ↔ **Omeprazole**
3. **Expected Result:**
   - Risk Level: SAFE
   - Severity Score: 0-15
   - Message: "No significant interaction risks detected"

### Example 4: Multiple Drugs Prescription
1. Go to **Prescriptions** page
2. Create prescription with:
   - **Paracetamol (500mg)**
   - **Ibuprofen (400mg)**
   - **Aspirin (300mg)**
3. **Expected Result:** System checks all pairs, may show multiple interaction warnings

---

## Drug ID Reference (Current Database)

| ID | Drug Name | Category | Dosage | Side Effects |
|----|-----------|----------|--------|--------------|
| 1 | Paracetamol | Analgesic | 500mg | Nausea, Rash |
| 2 | Ibuprofen | NSAID | 400mg | Stomach pain, Headache |
| 3 | Amoxicillin | Antibiotic | 250mg | Diarrhea, Allergic reaction |
| 4 | Cetirizine | Antihistamine | 10mg | Drowsiness, Dry mouth |
| 5 | Metformin | Anti-diabetic | 500mg | Vomiting, Weakness |
| 6 | Atorvastatin | Cholesterol | 20mg | Muscle pain, Liver issues |
| 7 | Azithromycin | Antibiotic | 500mg | Nausea, Stomach upset |
| 8 | Aspirin | Painkiller | 300mg | Bleeding, Upset stomach |
| 9 | Ciprofloxacin | Antibiotic | 500mg | Dizziness, Joint pain |
| 10 | Omeprazole | Antacid | 20mg | Constipation, Gas |

---

## Key Risk Factors to Test

1. ✅ **Same Category Conflict** → Use any two drugs with same category
   - Example: Amoxicillin + Azithromycin (both Antibiotic)
   - Score: 70 points → HIGH

2. ✅ **Side Effect Overlap** → Use drugs with matching side effects
   - Example: Paracetamol + Azithromycin (both have "Nausea")
   - Score: 15 points → SAFE (need 2+ overlaps for MODERATE)

3. ✅ **High Dosage** → Use drugs with combined dosage >1000mg
   - Note: Current drugs max at 500mg each, so pairs = max 1000mg (at threshold)
   - Need >1000mg for 45 points, >1500mg for 90 points

4. ✅ **Multiple Risk Factors** → Combine category conflict + high dosage + side effects
   - Example: Two antibiotics with overlapping side effects
   - Score: 70 + 15 = 85 points → HIGH

---

## API Testing

### Test Interaction Between Two Drugs
```bash
GET http://localhost:9002/interactions/analyze?drugA=3&drugB=7
```
Expected: HIGH risk (Amoxicillin ↔ Azithromycin)

### Test Prescription Creation
```bash
POST http://localhost:9003/prescriptions
Content-Type: application/json

{
  "patientName": "Test Patient",
  "doctorName": "Dr. Test",
  "items": [
    {"drugId": 3, "doseMg": 250},
    {"drugId": 7, "doseMg": 500},
    {"drugId": 9, "doseMg": 500}
  ]
}
```
Expected: Interaction summary should show HIGH risk for antibiotic pairs

---

## Summary

**Best combinations to demonstrate risk factors:**

1. **CRITICAL/Multiple HIGH:** Amoxicillin + Azithromycin + Ciprofloxacin (3 antibiotics)
2. **HIGH:** Amoxicillin + Azithromycin (2 antibiotics, same category)
3. **SAFE:** Cetirizine + Omeprazole (different categories, low dosage)
4. **Overlap Detection:** Paracetamol + Azithromycin (both cause nausea)

These examples will effectively demonstrate the interaction analyzer and prescription management risk detection capabilities!
