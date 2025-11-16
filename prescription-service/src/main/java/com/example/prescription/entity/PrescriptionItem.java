package com.example.prescription.entity;

import javax.persistence.*;

@Entity
@Table(name = "prescription_item")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long drugId;

    private Integer doseMg;

    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getDrugId(){return drugId;} public void setDrugId(Long drugId){this.drugId=drugId;}
    public Integer getDoseMg(){return doseMg;} public void setDoseMg(Integer doseMg){this.doseMg=doseMg;}
}
