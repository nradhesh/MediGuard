package com.example.prescription.service;

import com.example.prescription.client.DrugClient;
import com.example.prescription.client.InteractionClient;
import com.example.prescription.dto.DrugDTO;
import com.example.prescription.dto.InteractionResultDTO;
import com.example.prescription.entity.Prescription;
import com.example.prescription.entity.PrescriptionItem;
import com.example.prescription.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.StringJoiner;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repo;
    private final DrugClient drugClient;
    private final InteractionClient interactionClient;

    public PrescriptionService(PrescriptionRepository repo, DrugClient drugClient, InteractionClient interactionClient) {
        this.repo = repo;
        this.drugClient = drugClient;
        this.interactionClient = interactionClient;
    }

    @Transactional
    public Prescription createPrescription(Prescription p) {
        // validate drugs & compute interaction summary
        String summary = computeInteractionSummary(p.getItems());
        p.setInteractionSummary(summary);
        return repo.save(p);
    }

    public String validateOnly(Prescription p) {
        // Just compute summary without saving
        return computeInteractionSummary(p.getItems());
    }

    public Prescription getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Prescription> getAll() {
        return repo.findAll();
    }

    @Transactional
    public Prescription updatePrescription(Long id, Prescription updated) {
        Prescription existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Prescription not found"));
        existing.setPatientName(updated.getPatientName());
        existing.setDoctorName(updated.getDoctorName());
        existing.getItems().clear();
        existing.getItems().addAll(updated.getItems());
        existing.setInteractionSummary(computeInteractionSummary(existing.getItems()));
        return repo.save(existing);
    }

    public void deletePrescription(Long id) {
        repo.deleteById(id);
    }

    /**
     * For each pair of drugs among items, call interaction-service and build summary.
     */
    private String computeInteractionSummary(List<PrescriptionItem> items) {
        if (items == null || items.size() < 2) return "No interactions (less than 2 drugs).";

        StringJoiner sj = new StringJoiner("\n");
        for (int i = 0; i < items.size(); i++) {
            for (int j = i + 1; j < items.size(); j++) {
                PrescriptionItem a = items.get(i);
                PrescriptionItem b = items.get(j);

                // Fetch names (best-effort)
                DrugDTO da = drugClient.getDrug(a.getDrugId());
                DrugDTO db = drugClient.getDrug(b.getDrugId());

                String nameA = da != null && da.getName() != null ? da.getName() : String.valueOf(a.getDrugId());
                String nameB = db != null && db.getName() != null ? db.getName() : String.valueOf(b.getDrugId());

                InteractionResultDTO res = interactionClient.analyze(a.getDrugId(), b.getDrugId());
                sj.add(nameA + " <-> " + nameB + " => risk=" + res.getRiskLevel() + " score=" + res.getSeverityScore() + " message=" + res.getMessage());
            }
        }
        return sj.toString();
    }
}
