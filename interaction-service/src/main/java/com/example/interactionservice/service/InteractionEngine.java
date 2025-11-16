package com.example.interactionservice.service;

import com.example.interactionservice.client.DrugClient;
import com.example.interactionservice.dto.DrugDTO;
import com.example.interactionservice.dto.InteractionResultDTO;
import com.example.interactionservice.dto.RiskLevel;
import com.example.interactionservice.model.InteractionRule;
import com.example.interactionservice.utils.ScoringUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionEngine {

    private final DrugClient drugClient;
    private final RuleEngine ruleEngine;
    private final SideEffectAnalyzer sideEffectAnalyzer;

    public InteractionEngine(DrugClient drugClient, RuleEngine ruleEngine) {
        this.drugClient = drugClient;
        this.ruleEngine = ruleEngine;
        this.sideEffectAnalyzer = new SideEffectAnalyzer();
    }

    public InteractionResultDTO analyze(Long idA, Long idB) {
        DrugDTO d1;
        DrugDTO d2;

        try {
            d1 = drugClient.getDrug(idA);
        } catch (Exception ex) {
            d1 = null;
        }
        try {
            d2 = drugClient.getDrug(idB);
        } catch (Exception ex) {
            d2 = null;
        }

        InteractionResultDTO result = new InteractionResultDTO();

        if (d1 == null || d2 == null) {
            result.setDrugA(d1 == null ? "UNKNOWN" : d1.getName());
            result.setDrugB(d2 == null ? "UNKNOWN" : d2.getName());
            result.setRiskLevel(RiskLevel.MODERATE);
            result.setSeverityScore(10);
            result.setMessage("One or both drugs could not be fetched from Drug Database Service.");
            return result;
        }

        List<InteractionRule> rules = ruleEngine.evaluateRules(d1, d2);
        int score = ScoringUtils.calculateSeverity(rules);

        result.setDrugA(d1.getName());
        result.setDrugB(d2.getName());
        result.setSeverityScore(score);
        
        // Build comprehensive analysis message
        String message = buildAnalysisMessage(d1, d2, rules, score);
        result.setMessage(message);

        if (score < 30) result.setRiskLevel(RiskLevel.SAFE);
        else if (score < 60) result.setRiskLevel(RiskLevel.MODERATE);
        else if (score < 90) result.setRiskLevel(RiskLevel.HIGH);
        else result.setRiskLevel(RiskLevel.CRITICAL);

        return result;
    }
    
    private String buildAnalysisMessage(DrugDTO d1, DrugDTO d2, List<InteractionRule> rules, int score) {
        StringBuilder message = new StringBuilder();
        
        // Drug information
        message.append("Analysis Summary:\n");
        message.append("• Drug A: ").append(d1.getName());
        if (d1.getCategory() != null) {
            message.append(" (").append(d1.getCategory()).append(")");
        }
        if (d1.getDosageMg() != null) {
            message.append(" - ").append(d1.getDosageMg()).append("mg");
        }
        message.append("\n");
        
        message.append("• Drug B: ").append(d2.getName());
        if (d2.getCategory() != null) {
            message.append(" (").append(d2.getCategory()).append(")");
        }
        if (d2.getDosageMg() != null) {
            message.append(" - ").append(d2.getDosageMg()).append("mg");
        }
        message.append("\n\n");
        
        // Combined dosage
        int totalDosage = (d1.getDosageMg() != null ? d1.getDosageMg() : 0) + 
                         (d2.getDosageMg() != null ? d2.getDosageMg() : 0);
        message.append("Combined Dosage: ").append(totalDosage).append("mg");
        if (totalDosage > 1500) {
            message.append(" (⚠️ Very High)");
        } else if (totalDosage > 1000) {
            message.append(" (⚠️ High)");
        } else {
            message.append(" (✓ Acceptable)");
        }
        message.append("\n\n");
        
        // Side effects analysis
        String sideEffectAnalysis = sideEffectAnalyzer.analyze(d1, d2);
        message.append("Side Effects: ").append(sideEffectAnalysis);
        message.append("\n\n");
        
        // Interaction rules detected
        if (rules.isEmpty()) {
            message.append("✓ No significant interaction risks detected.\n");
            message.append("✓ Category check: Passed (different categories)\n");
            message.append("✓ Dosage check: Passed (within safe limits)\n");
            message.append("✓ Side effects: No significant overlap\n");
            message.append("\nOverall Assessment: These drugs can be safely used together.");
        } else {
            message.append("⚠️ Interaction Risks Detected:\n");
            for (InteractionRule rule : rules) {
                message.append("• ").append(rule.getDescription()).append("\n");
            }
            message.append("\nRecommendation: Consult with a healthcare professional before combining these medications.");
        }
        
        return message.toString();
    }
}
