package com.example.prescription.client;

import com.example.prescription.dto.InteractionResultDTO;
import com.example.prescription.dto.RiskLevel;
import org.springframework.stereotype.Component;

@Component
public class InteractionClientFallback implements InteractionClient {
    @Override
    public InteractionResultDTO analyze(Long drugA, Long drugB) {
        InteractionResultDTO r = new InteractionResultDTO();
        r.setDrugA("UNKNOWN");
        r.setDrugB("UNKNOWN");
        r.setRiskLevel(RiskLevel.MODERATE);
        r.setSeverityScore(10);
        r.setMessage("Interaction service unavailable (fallback).");
        return r;
    }
}
