package com.example.interactionservice.dto;

public class InteractionResultDTO {
    private String drugA;
    private String drugB;
    private RiskLevel riskLevel;
    private int severityScore;
    private String message;

    public InteractionResultDTO() {}

    public String getDrugA() { return drugA;}
    public void setDrugA(String drugA) { this.drugA = drugA;}
    public String getDrugB() { return drugB;}
    public void setDrugB(String drugB) { this.drugB = drugB;}
    public RiskLevel getRiskLevel() { return riskLevel;}
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel;}
    public int getSeverityScore() { return severityScore;}
    public void setSeverityScore(int severityScore) { this.severityScore = severityScore;}
    public String getMessage() { return message;}
    public void setMessage(String message) { this.message = message;}
}
