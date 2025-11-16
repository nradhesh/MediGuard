package com.example.interactionservice.service;

import com.example.interactionservice.dto.DrugDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

public class SideEffectAnalyzer {

    public String analyze(DrugDTO d1, DrugDTO d2) {
        if (d1 == null || d2 == null) return "One or both drugs not found.";

        if (d1.getSideEffects() == null || d2.getSideEffects() == null) {
            return "No side-effect data available for one or both drugs.";
        }

        long common = d1.getSideEffects().stream()
                .filter(d2.getSideEffects()::contains)
                .count();

        if (common == 0) {
            return "No overlapping side effects detected.";
        } else if (common == 1) {
            // Find the common side effect
            String commonEffect = d1.getSideEffects().stream()
                    .filter(d2.getSideEffects()::contains)
                    .findFirst()
                    .orElse("Unknown");
            return "Single overlapping side effect: " + commonEffect;
        } else {
            // List all common side effects
            List<String> commonEffects = d1.getSideEffects().stream()
                    .filter(d2.getSideEffects()::contains)
                    .collect(Collectors.toList());
            return "Multiple overlapping side effects (" + common + "): " + 
                   String.join(", ", commonEffects);
        }
    }
}
