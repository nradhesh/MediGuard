package com.example.prescription.dto;

import java.util.List;

public class PrescriptionDTO {
    private Long id;
    private String patientName;
    private String doctorName;
    private List<PrescriptionItemDTO> items;
    private String createdAt;
    private String interactionSummary; // computed

    public static class PrescriptionItemDTO {
        private Long drugId;
        private Integer doseMg;
        public Long getDrugId() { return drugId; }
        public void setDrugId(Long drugId) { this.drugId = drugId; }
        public Integer getDoseMg() { return doseMg; }
        public void setDoseMg(Integer doseMg) { this.doseMg = doseMg; }
    }

    // getters & setters omitted for brevity; include them in file
    public Long getId() {return id;} public void setId(Long id){this.id=id;}
    public String getPatientName(){return patientName;} public void setPatientName(String patientName){this.patientName=patientName;}
    public String getDoctorName(){return doctorName;} public void setDoctorName(String doctorName){this.doctorName=doctorName;}
    public List<PrescriptionItemDTO> getItems(){return items;} public void setItems(List<PrescriptionItemDTO> items){this.items=items;}
    public String getCreatedAt(){return createdAt;} public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
    public String getInteractionSummary(){return interactionSummary;} public void setInteractionSummary(String s){this.interactionSummary=s;}
}
