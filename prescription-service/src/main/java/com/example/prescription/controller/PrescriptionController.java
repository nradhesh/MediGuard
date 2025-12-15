package com.example.prescription.controller;

import com.example.prescription.entity.Prescription;
import com.example.prescription.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionService svc;

    public PrescriptionController(PrescriptionService svc) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<Prescription> create(@RequestBody Prescription p) {
        Prescription saved = svc.createPrescription(p);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> get(@PathVariable Long id) {
        Prescription p = svc.getById(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    @GetMapping
    public List<Prescription> all() {
        return svc.getAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> update(@PathVariable Long id, @RequestBody Prescription p) {
        Prescription saved = svc.updatePrescription(id, p);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        svc.deletePrescription(id);
        return ResponseEntity.ok("Deleted");
    }

    /**
     * Validate (simulate) a prescription without saving.
     */
    @PostMapping("/validate")
    public ResponseEntity<String> validate(@RequestBody Prescription p) {
        String summary = svc.validateOnly(p);
        return ResponseEntity.ok(summary);
    }
}
