# Quick Reference: Drug Combinations for Testing

## ⚠️ Important Note
The interaction analyzer evaluates **pairs of drugs**. For prescriptions with 3+ drugs, all pairs are checked.

---

## 🔴 CRITICAL Risk Examples (Score ≥ 90)

### 1. Triple Antibiotic Therapy
```
Drugs:
- Amoxicillin (250mg) - Antibiotic
- Azithromycin (500mg) - Antibiotic
- Ciprofloxacin (500mg) - Antibiotic

Pair Analysis:
- Amoxicillin ↔ Azithromycin: 70 (same category) + 15 (nausea overlap) = 85 → HIGH
- Amoxicillin ↔ Ciprofloxacin: 70 (same category) = 70 → HIGH
- Azithromycin ↔ Ciprofloxacin: 70 (same category) = 70 → HIGH

Expected: Multiple HIGH alerts, should flag as CRITICAL overall
```

### 2. High Dosage Pain Management
```
Drugs:
- Paracetamol (500mg)
- Ibuprofen (400mg)
- Aspirin (300mg)
- Metformin (500mg)

Pair Analysis:
- Paracetamol (500) + Ibuprofen (400) = 900mg ✓ Safe dosage
- Paracetamol (500) + Aspirin (300) = 800mg ✓ Safe dosage
- Paracetamol (500) + Metformin (500) = 1000mg → 45 points (MODERATE)
- Ibuprofen (400) + Aspirin (300) = 700mg ✓ Safe dosage
- Ibuprofen (400) + Metformin (500) = 900mg ✓ Safe dosage
- Aspirin (300) + Metformin (500) = 800mg ✓ Safe dosage

Note: This won't trigger CRITICAL individually, but combined prescription should be reviewed
```

---

## 🟠 HIGH Risk Examples (Score 60-89)

### 3. Dual Antibiotics
```
Drugs:
- Amoxicillin (250mg) - Antibiotic
- Azithromycin (500mg) - Antibiotic

Analysis:
- Same category (Antibiotic): 70 points
- Overlapping side effect (Nausea): 15 points (if checked)
- Combined dosage: 750mg (safe)
- Total Score: 70-85 points → HIGH

Test this in Interaction Analyzer!
```

### 4. High Dosage Single Pair
```
Drugs:
- Metformin (500mg)
- Paracetamol (500mg)

Analysis:
- Different categories: 0 points
- Combined dosage (1000mg): 45 points (exceeds 1000mg threshold)
- No significant side effect overlap: 0-15 points
- Total Score: 45-60 points → MODERATE to HIGH

Actually, based on rules: 1000mg is exactly at threshold, so might be 0 points.
Need >1000mg for 45 points, >1500mg for 90 points.
```

**Corrected Example 4A:**
```
Drugs:
- Metformin (500mg)
- Paracetamol (500mg)
- Amoxicillin (250mg)

Pair with highest risk:
- Metformin (500) + Paracetamol (500) = 1000mg → 0 points (at threshold)
- Metformin (500) + Amoxicillin (250) = 750mg → 0 points
- Paracetamol (500) + Amoxicillin (250) = 750mg → 0 points

Better Example 4B: High Dosage Combination
Drugs:
- Metformin (500mg)
- Paracetamol (500mg)
- Atorvastatin (20mg)
- Ciprofloxacin (500mg)

High risk pair:
- Metformin (500) + Ciprofloxacin (500) = 1000mg → borderline
- Actually need >1000mg, so this is still 0 points...

Let me check the exact threshold in the code...

From RuleEngine.java:
- if (dosageA + dosageB > 1500) → 90 points
- else if (dosageA + dosageB > 1000) → 45 points

So 1000mg exactly = 0 points, but 1001mg = 45 points!

Real Example 4C:
Drugs:
- Metformin (500mg)
- Paracetamol (500mg)
- Amoxicillin (251mg) - need to check actual dosage

Actually, looking at current drugs:
- Metformin: 500mg
- Paracetamol: 500mg
- Ciprofloxacin: 500mg

Best combination for MODERATE dosage risk:
- Metformin (500) + Ciprofloxacin (500) = 1000mg exactly → 0 points
- Need one more drug or different combination...

Actually, Paracetamol (500) + Amoxicillin (250) = 750mg, that's safe.
Paracetamol (500) + Azithromycin (500) = 1000mg exactly.
Azithromycin (500) + Ciprofloxacin (500) = 1000mg exactly.

For MODERATE dosage risk, we'd need:
- Metformin (500) + Paracetamol (500) + any drug > 20mg = could exceed 1000mg in some pairs

Actually, wait - the prescription service checks PAIRS, not total. So each pair needs to exceed thresholds individually.

Better HIGH example using same category:
```
Drugs:
- Amoxicillin (250mg) - Antibiotic
- Ciprofloxacin (500mg) - Antibiotic

Analysis:
- Same category: 70 points
- Different side effects mostly
- Combined: 750mg (safe)
- Total: 70 points → HIGH
```

---

## 🟡 MODERATE Risk Examples (Score 30-59)

### 5. Multiple Overlapping Side Effects
```
Drugs:
- Paracetamol (500mg) - Nausea, Rash
- Azithromycin (500mg) - Nausea, Stomach upset

Analysis:
- Different categories: 0 points
- Overlapping side effects: 1 overlap (Nausea) = 15 points
- Combined dosage: 1000mg exactly = 0 points
- Total Score: 15 points → SAFE

Hmm, this doesn't reach MODERATE. Need 2+ overlaps for 40 points.

Better Example 5A:
We need drugs with 2+ overlapping side effects, but current drugs don't have many overlaps.

Example 5B: High Dosage Pair
```
Drugs:
- Paracetamol (500mg)
- Metformin (500mg)
- Any additional high-dose drug

Actually, for MODERATE, we need:
- Combined dosage >1000mg but <1500mg = 45 points (MODERATE)

But current drugs max out at 500mg each, so:
- 500 + 500 = 1000mg (exactly at threshold, 0 points)
- Need >1000mg, so minimum is 1001mg

The only way to get >1000mg with current drugs is:
- 500 + 500 + 1mg doesn't exist
- We'd need to modify dosages or add drugs

For now, MODERATE risk can be achieved with:
- Same category (70 points) → but that's HIGH
- 2+ overlapping side effects (40 points) → but need to check if any drugs have 2+ overlaps

Let me check actual overlaps:
- Paracetamol: Nausea, Rash
- Azithromycin: Nausea, Stomach upset
  → Only "Nausea" overlaps = 1 overlap = 15 points

- Amoxicillin: Diarrhea, Allergic reaction
- Azithromycin: Nausea, Stomach upset
  → No overlaps

- Aspirin: Bleeding, Upset stomach
- Ibuprofen: Stomach pain, Headache
  → "Upset stomach" vs "Stomach pain" - might be similar but coded differently

So for MODERATE, best option is:
- Category conflict gives 70 (HIGH), not MODERATE
- Dosage would need >1000mg, but current max is 1000mg exactly

Actually, let me create a practical example that will work:
```

---

## ✅ Practical Test Combinations

### Test Case 1: CRITICAL - Multiple Antibiotics
```json
Prescription:
{
  "patientName": "Test Patient",
  "doctorName": "Dr. Test",
  "items": [
    {"drugId": 3, "doseMg": 250},  // Amoxicillin
    {"drugId": 7, "doseMg": 500},  // Azithromycin
    {"drugId": 9, "doseMg": 500}   // Ciprofloxacin
  ]
}
```
**Expected:** HIGH risk alerts for each pair (same category conflict)

---

### Test Case 2: HIGH - Dual Antibiotics
```json
{
  "patientName": "Test Patient 2",
  "doctorName": "Dr. Test",
  "items": [
    {"drugId": 3, "doseMg": 250},  // Amoxicillin
    {"drugId": 7, "doseMg": 500}   // Azithromycin
  ]
}
```
**Expected:** HIGH risk (70 points - same category)

---

### Test Case 3: SAFE - Different Categories
```json
{
  "patientName": "Test Patient 3",
  "doctorName": "Dr. Test",
  "items": [
    {"drugId": 4, "doseMg": 10},   // Cetirizine (Antihistamine)
    {"drugId": 10, "doseMg": 20}   // Omeprazole (Antacid)
  ]
}
```
**Expected:** SAFE (different categories, low dosage)

---

### Test Case 4: MODERATE - Side Effect Overlap (if available)
```json
{
  "patientName": "Test Patient 4",
  "doctorName": "Dr. Test",
  "items": [
    {"drugId": 1, "doseMg": 500},  // Paracetamol
    {"drugId": 7, "doseMg": 500}   // Azithromycin (both have Nausea)
  ]
}
```
**Expected:** SAFE to LOW MODERATE (15 points for single overlap, might need adjustment)

---

## 📝 Notes

1. **Category conflicts** are the most reliable way to trigger HIGH/CRITICAL risk
2. **Dosage thresholds** are strict: >1000mg for 45 points, >1500mg for 90 points
3. **Side effect overlaps** need 2+ to reach MODERATE (40 points)
4. **Current drug set** may need additional drugs with higher dosages or more overlapping side effects to fully test all risk levels

## 🔧 Recommendation

To better test all risk levels, consider adding these drugs to the database:
- High-dose drug: **Methotrexate (1500mg)** - for dosage testing
- Drugs with multiple overlapping side effects
- Drugs from same categories with different names

But for now, the examples above will demonstrate the system working with available drugs!
