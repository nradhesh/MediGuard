package com.example.drugdb.controller;

import com.example.drugdb.entity.Drug;
import com.example.drugdb.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/data")
public class DataController {

    @Autowired
    private DrugRepository drugRepository;

    /**
     * Manually trigger data loading if database is empty
     */
    @PostMapping("/load-sample")
    public String loadSampleData() {
        long count = drugRepository.count();
        
        if (count > 0) {
            return "Database already contains " + count + " drugs. Use DELETE /data/clear to clear database first.";
        }

        try {
            Drug d1 = create("Paracetamol", "Analgesic", 500, Arrays.asList("Nausea", "Rash"));
            Drug d2 = create("Ibuprofen", "NSAID", 400, Arrays.asList("Stomach pain", "Headache"));
            Drug d3 = create("Amoxicillin", "Antibiotic", 250, Arrays.asList("Diarrhea", "Allergic reaction"));
            Drug d4 = create("Cetirizine", "Antihistamine", 10, Arrays.asList("Drowsiness", "Dry mouth"));
            Drug d5 = create("Metformin", "Anti-diabetic", 500, Arrays.asList("Vomiting", "Weakness"));
            Drug d6 = create("Atorvastatin", "Cholesterol", 20, Arrays.asList("Muscle pain", "Liver issues"));
            Drug d7 = create("Azithromycin", "Antibiotic", 500, Arrays.asList("Nausea", "Stomach upset"));
            Drug d8 = create("Aspirin", "Painkiller", 300, Arrays.asList("Bleeding", "Upset stomach"));
            Drug d9 = create("Ciprofloxacin", "Antibiotic", 500, Arrays.asList("Dizziness", "Joint pain"));
            Drug d10 = create("Omeprazole", "Antacid", 20, Arrays.asList("Constipation", "Gas"));

            List<Drug> drugs = Arrays.asList(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
            drugRepository.saveAll(drugs);
            
            return "Successfully loaded " + drugs.size() + " sample drugs.";
        } catch (Exception e) {
            return "Error loading sample data: " + e.getMessage();
        }
    }

    /**
     * Clear all drugs from database (use with caution)
     */
    @DeleteMapping("/clear")
    public String clearDatabase() {
        long count = drugRepository.count();
        drugRepository.deleteAll();
        return "Cleared " + count + " drugs from database.";
    }

    /**
     * Get database statistics
     */
    @GetMapping("/stats")
    public String getStats() {
        long count = drugRepository.count();
        return "Database contains " + count + " drugs.";
    }

    private Drug create(String name, String category, int dosage, List<String> effects) {
        Drug drug = new Drug();
        drug.setName(name);
        drug.setCategory(category);
        drug.setDosageMg(dosage);
        drug.setSideEffects(effects);
        return drug;
    }
}


