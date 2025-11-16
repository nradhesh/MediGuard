package com.example.interactionservice.service;

import com.example.interactionservice.dto.DrugDTO;
import com.example.interactionservice.model.ConflictType;
import com.example.interactionservice.model.InteractionRule;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RuleEngine {

    public List<InteractionRule> evaluateRules(DrugDTO d1, DrugDTO d2) {
        List<InteractionRule> rules = new ArrayList<>();

        if (d1 == null || d2 == null) return rules;

        // Rule: Same category => high severity
        if (d1.getCategory() != null && d1.getCategory().equalsIgnoreCase(d2.getCategory())) {
            rules.add(new InteractionRule(
                    ConflictType.CATEGORY_CONFLICT,
                    70,
                    "Both drugs are in same category: " + d1.getCategory()
            ));
        }

        // Rule: Side-effect overlap
        long overlap = 0;
        if (d1.getSideEffects() != null && d2.getSideEffects() != null) {
            overlap = d1.getSideEffects().stream()
                    .filter(d2.getSideEffects()::contains)
                    .count();
        }

        if (overlap >= 2) {
            rules.add(new InteractionRule(
                    ConflictType.SIDE_EFFECT_OVERLAP,
                    40,
                    "Multiple overlapping side effects: " + overlap
            ));
        } else if (overlap == 1) {
            rules.add(new InteractionRule(
                    ConflictType.SIDE_EFFECT_OVERLAP,
                    15,
                    "Single overlapping side effect"
            ));
        }

        // Rule: Combined dosage too high
        int dosageA = d1.getDosageMg() == null ? 0 : d1.getDosageMg();
        int dosageB = d2.getDosageMg() == null ? 0 : d2.getDosageMg();

        if (dosageA + dosageB > 1500) {
            rules.add(new InteractionRule(
                    ConflictType.HIGH_DOSAGE_COMBINATION,
                    90,
                    "Combined dosage is greater than 1500 mg"
            ));
        } else if (dosageA + dosageB > 1000) {
            rules.add(new InteractionRule(
                    ConflictType.HIGH_DOSAGE_COMBINATION,
                    45,
                    "Combined dosage is between 1000 and 1500 mg"
            ));
        }

        return rules;
    }
}
