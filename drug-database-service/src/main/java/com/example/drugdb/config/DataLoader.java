package com.example.drugdb.config;

import com.example.drugdb.entity.Drug;
import com.example.drugdb.repository.DrugRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class DataLoader implements CommandLineRunner {

    private final DrugRepository drugRepository;

    public DataLoader(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            long count = drugRepository.count();
            System.out.println("Current drug count in database: " + count);
            
            if (count == 0) {
                System.out.println("Database is empty. Loading sample drugs...");
                
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

                List<Drug> saved = drugRepository.saveAll(drugs);
                System.out.println("Successfully inserted " + saved.size() + " sample drugs.");
                System.out.println("Drug names: " + saved.stream().map(Drug::getName).collect(Collectors.joining(", ")));
            } else {
                System.out.println("Database already contains " + count + " drugs. Skipping data load.");
            }
        } catch (Exception e) {
            System.err.println("Error loading sample drugs: " + e.getMessage());
            e.printStackTrace();
        }
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
