package com.example.interactionservice.model;

public class InteractionRule {
    private ConflictType type;
    private int severity;
    private String description;

    public InteractionRule() {}

    public InteractionRule(ConflictType type, int severity, String description) {
        this.type = type;
        this.severity = severity;
        this.description = description;
    }

    public ConflictType getType() { return type;}
    public void setType(ConflictType type) { this.type = type;}
    public int getSeverity() { return severity;}
    public void setSeverity(int severity) { this.severity = severity;}
    public String getDescription() { return description;}
    public void setDescription(String description) { this.description = description;}
}
