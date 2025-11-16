# Drug Interaction Examples - Risk Factor Demonstrations

This document provides drug combinations that demonstrate different risk levels in the prescription management and interaction analyzer system.

## System Risk Assessment Logic

The system evaluates drug interactions based on:
1. **Category Conflict**: Same category = 70 points (HIGH risk)
2. **Side Effect Overlap**: 
   - 2+ overlapping = 40 points (MODERATE)
   - 1 overlapping = 15 points (SAFE)
3. **High Dosage Combination**:
   - >1500mg total = 90 points (CRITICAL)
   - 1000-1500mg = 45 points (MODERATE)

**Risk Levels:**
- **SAFE**: < 30 points
- **MODERATE**: 30-59 points
- **HIGH**: 60-89 points
- **CRITICAL**: ≥ 90 points

---

## Current Drugs in Database

| ID | Drug Name | Category | Dosage (mg) | Side Effects |
|----|-----------|----------|-------------|--------------|
| 1 | Paracetamol | Analgesic | 500 | Nausea, Rash |
| 2 | Ibuprofen | NSAID | 400 | Stomach pain, Headache |
| 3 | Amoxicillin | Antibiotic | 250 | Diarrhea, Allergic reaction |
| 4 | Cetirizine | Antihistamine | 10 | Drowsiness, Dry mouth |
| 5 | Metformin | Anti-diabetic | 500 | Vomiting, Weakness |
| 6 | Atorvastatin | Cholesterol | 20 | Muscle pain, Liver issues |
| 7 | Azithromycin | Antibiotic | 500 | Nausea, Stomach upset |
| 8 | Aspirin | Painkiller | 300 | Bleeding, Upset stomach |
| 9 | Ciprofloxacin | Antibiotic | 500 | Dizziness, Joint pain |
| 10 | Omeprazole | Antacid | 20 | Constipation, Gas |

---

## Example Drug Combinations by Risk Level

### 🔴 CRITICAL Risk (≥ 90 points)

#### Example 1: Multiple Antibiotics + High Dosage
**Drugs:**
- Amoxicillin (250mg) - Antibiotic
- Azithromycin (500mg) - Antibiotic  
- Ciprofloxacin (500mg) - Antibiotic

**Risk Factors:**
- ✅ Same category conflict (Antibiotic): 70 points
- ✅ High combined dosage (1250mg): 45 points
- ✅ Multiple overlapping side effects: 40 points
- **Total Score: ~155 points → CRITICAL**

**Why This Is Risky:**
- Triple antibiotic therapy increases risk of antibiotic resistance
- Combined dosage exceeds 1000mg threshold
- Overlapping gastrointestinal side effects (Nausea, Stomach upset)

---

#### Example 2: High Dosage Painkillers
**Drugs:**
- Paracetamol (500mg) - Analgesic
- Ibuprofen (400mg) - NSAID
- Aspirin (300mg) - Painkiller
- Metformin (500mg) - Anti-diabetic

**Risk Factors:**
- ✅ High combined dosage (1700mg): 90 points
- ✅ Multiple side effect overlaps: 40 points
- **Total Score: ~130 points → CRITICAL**

**Why This Is Risky:**
- Total dosage exceeds 1500mg threshold significantly
- Multiple analgesics can cause liver/kidney damage
- Combined gastrointestinal side effects

---

### 🟠 HIGH Risk (60-89 points)

#### Example 3: Dual Antibiotic Therapy
**Drugs:**
- Amoxicillin (250mg) - Antibiotic
- Azithromycin (500mg) - Antibiotic

**Risk Factors:**
- ✅ Same category conflict (Antibiotic): 70 points
- ✅ Overlapping side effects (Nausea): 15 points
- **Total Score: ~85 points → HIGH**

**Why This Is Risky:**
- Dual antibiotic use increases risk of resistance
- Both can cause gastrointestinal issues
- Potential for Clostridium difficile infection

---

#### Example 4: Multiple Pain Relievers
**Drugs:**
- Paracetamol (500mg) - Analgesic
- Aspirin (300mg) - Painkiller
- Ibuprofen (400mg) - NSAID

**Risk Factors:**
- ✅ High combined dosage (1200mg): 45 points
- ✅ Multiple overlapping side effects: 40 points
- **Total Score: ~85 points → HIGH**

**Why This Is Risky:**
- Combined analgesics increase bleeding risk (Aspirin)
- Liver toxicity risk with multiple painkillers
- Gastrointestinal irritation

---

### 🟡 MODERATE Risk (30-59 points)

#### Example 5: Antibiotic + High Dosage Drug
**Drugs:**
- Azithromycin (500mg) - Antibiotic
- Ciprofloxacin (500mg) - Antibiotic

**Risk Factors:**
- ✅ Same category conflict (Antibiotic): 70 points
- ❌ But wait - this should be HIGH...

**Alternative Example 5A: Painkiller with Overlapping Side Effects**
**Drugs:**
- Paracetamol (500mg) - Analgesic
- Azithromycin (500mg) - Antibiotic

**Risk Factors:**
- ✅ Overlapping side effects (Nausea): 15 points
- ✅ Combined dosage (1000mg): 0 points (exactly at threshold)
- **Total Score: ~15 points → SAFE**

**Alternative Example 5B: Prescription with Moderate Dosage**
**Drugs:**
- Metformin (500mg) - Anti-diabetic
- Paracetamol (500mg) - Analgesic
- Atorvastatin (20mg) - Cholesterol

**Risk Factors:**
- ✅ Combined dosage (1020mg): 45 points
- **Total Score: ~45 points → MODERATE**

---

#### Example 6: Gastrointestinal Risk Combination
**Drugs:**
- Aspirin (300mg) - Painkiller
- Ibuprofen (400mg) - NSAID

**Risk Factors:**
- ✅ Combined dosage (700mg): 0 points
- ✅ Overlapping side effects (Upset stomach): 15 points
- ❌ But both are pain-related...
- **Total Score: ~15 points → SAFE**

**Better Example 6A:**
**Drugs:**
- Aspirin (300mg) - Painkiller
- Ibuprofen (400mg) - NSAID  
- Omeprazole (20mg) - Antacid

**Risk Factors:**
- ✅ Combined dosage (720mg): 0 points
- ✅ Multiple overlapping side effects (Upset stomach): 15 points
- **Total Score: ~15 points → SAFE** (may need adjustment in rules)

---

### 🟢 SAFE Risk (< 30 points)

#### Example 7: Different Categories, Low Dosage
**Drugs:**
- Cetirizine (10mg) - Antihistamine
- Omeprazole (20mg) - Antacid

**Risk Factors:**
- ✅ Different categories
- ✅ Low combined dosage (30mg)
- ✅ No overlapping side effects
- **Total Score: 0 points → SAFE**

---

#### Example 8: Complementary Medications
**Drugs:**
- Atorvastatin (20mg) - Cholesterol
- Metformin (500mg) - Anti-diabetic
- Cetirizine (10mg) - Antihistamine

**Risk Factors:**
- ✅ Different categories
- ✅ Combined dosage (530mg) - well below threshold
- ✅ Minimal side effect overlap
- **Total Score: ~15 points → SAFE**

---

## Recommended Test Scenarios for Prescription Management

### Scenario 1: Critical Alert Test
**Prescription:**
- Patient: John Doe
- Doctor: Dr. Smith
- Drugs:
  1. Amoxicillin (250mg) - Antibiotic
  2. Azithromycin (500mg) - Antibiotic
  3. Ciprofloxacin (500mg) - Antibiotic

**Expected Result:** CRITICAL risk alert, recommendation to consult healthcare professional

---

### Scenario 2: High Risk Warning
**Prescription:**
- Patient: Jane Smith
- Doctor: Dr. Johnson
- Drugs:
  1. Paracetamol (500mg) - Analgesic
  2. Aspirin (300mg) - Painkiller
  3. Ibuprofen (400mg) - NSAID

**Expected Result:** HIGH risk, multiple interaction warnings

---

### Scenario 3: Moderate Caution
**Prescription:**
- Patient: Bob Wilson
- Doctor: Dr. Brown
- Drugs:
  1. Metformin (500mg) - Anti-diabetic
  2. Paracetamol (500mg) - Analgesic
  3. Atorvastatin (20mg) - Cholesterol

**Expected Result:** MODERATE risk due to combined dosage

---

### Scenario 4: Safe Combination
**Prescription:**
- Patient: Alice Johnson
- Doctor: Dr. Davis
- Drugs:
  1. Cetirizine (10mg) - Antihistamine
  2. Omeprazole (20mg) - Antacid

**Expected Result:** SAFE, no significant interactions

---

## Additional Risk Combinations to Test

### High Dosage + Same Category
- **Amoxicillin + Azithromycin + Ciprofloxacin** (All Antibiotics)
  - Category conflict + High dosage = CRITICAL

### Overlapping Side Effects
- **Paracetamol + Azithromycin** (Both have "Nausea")
  - Single overlap = SAFE, but watch for additive effects

### Multiple Overlaps
- **Aspirin + Ibuprofen** (Both cause "Upset stomach")
  - Single overlap, but both are analgesics = may need additional rules

---

## Notes for Testing

1. **Category Conflicts** are the strongest predictor of HIGH risk
2. **Dosage combinations** >1500mg trigger CRITICAL risk
3. **Side effect overlaps** of 2+ create MODERATE risk
4. **Combination of factors** (category + dosage + side effects) can escalate to CRITICAL

## How to Use These Examples

1. **In Prescription Management UI:**
   - Create a new prescription
   - Add the drugs listed in each scenario
   - Observe the risk alerts and interaction summaries

2. **In Interaction Analyzer UI:**
   - Select drug pairs from the examples
   - Check the severity scores and risk levels
   - Review the detailed analysis messages

3. **API Testing:**
   - Use POST `/prescriptions` with the drug combinations
   - Check the `interactionSummary` field in the response
   - Use GET `/interactions/analyze?drugA={id}&drugB={id}` for pair analysis
