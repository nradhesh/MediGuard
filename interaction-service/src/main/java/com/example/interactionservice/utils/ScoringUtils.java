package com.example.interactionservice.utils;

import com.example.interactionservice.model.InteractionRule;

import java.util.List;

public class ScoringUtils {

    public static int calculateSeverity(List<InteractionRule> rules) {
        if (rules == null || rules.isEmpty()) return 0;
        return rules.stream().mapToInt(InteractionRule::getSeverity).sum();
    }
}
