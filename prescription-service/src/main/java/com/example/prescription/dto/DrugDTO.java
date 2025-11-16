package com.example.prescription.dto;

import java.util.List;

public class DrugDTO {
    private Long id;
    private String name;
    private String category;
    private Integer dosageMg;
    private List<String> sideEffects;

    public DrugDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDosageMg() { return dosageMg; }
    public void setDosageMg(Integer dosageMg) { this.dosageMg = dosageMg; }

    public List<String> getSideEffects() { return sideEffects; }
    public void setSideEffects(List<String> sideEffects) { this.sideEffects = sideEffects; }
}
