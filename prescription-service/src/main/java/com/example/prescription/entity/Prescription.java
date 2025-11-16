package com.example.prescription.entity;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String doctorName;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "prescription_id")
    private List<PrescriptionItem> items = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String interactionSummary;

    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getPatientName(){return patientName;} public void setPatientName(String p){this.patientName=p;}
    public String getDoctorName(){return doctorName;} public void setDoctorName(String d){this.doctorName=d;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime c){this.createdAt=c;}
    public List<PrescriptionItem> getItems(){return items;} public void setItems(List<PrescriptionItem> items){this.items=items;}
    public String getInteractionSummary(){return interactionSummary;} public void setInteractionSummary(String s){this.interactionSummary=s;}
}
