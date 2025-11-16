package com.example.drugdb.controller;

import com.example.drugdb.entity.Drug;
import com.example.drugdb.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drugs")
public class DrugController {

    @Autowired
    private DrugRepository drugRepository;

    // CREATE - Single Drug
    @PostMapping
    public Drug addDrug(@RequestBody Drug drug) {
        return drugRepository.save(drug);
    }

    // CREATE - BULK Insert (IMPORTANT)
    @PostMapping("/bulk")
    public List<Drug> addDrugsBulk(@RequestBody List<Drug> drugs) {
        return drugRepository.saveAll(drugs);
    }

    // READ SINGLE
    @GetMapping("/{id}")
    public Drug getDrug(@PathVariable Long id) {
        return drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
    }

    // READ ALL
    @GetMapping
    public List<Drug> getAllDrugs() {
        return drugRepository.findAll();
    }

    // UPDATE
    @PutMapping("/{id}")
    public Drug updateDrug(@PathVariable Long id, @RequestBody Drug updatedDrug) {
        return drugRepository.findById(id).map(drug -> {
            drug.setName(updatedDrug.getName());
            drug.setCategory(updatedDrug.getCategory());
            drug.setDosageMg(updatedDrug.getDosageMg());
            drug.setSideEffects(updatedDrug.getSideEffects());
            return drugRepository.save(drug);
        }).orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteDrug(@PathVariable Long id) {
        if (!drugRepository.existsById(id)) {
            return "Drug not found with id: " + id;
        }
        drugRepository.deleteById(id);
        return "Deleted drug with id: " + id;
    }

    // GET COUNT - For debugging
    @GetMapping("/count")
    public Long getDrugCount() {
        return drugRepository.count();
    }
}
