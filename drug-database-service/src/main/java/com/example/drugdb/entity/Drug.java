package com.example.drugdb.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "drug")
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    private Integer dosageMg;

    @ElementCollection
    @CollectionTable(name = "drug_side_effects", joinColumns = @JoinColumn(name = "drug_id"))
    @Column(name = "side_effect")
    private List<String> sideEffects;
}
