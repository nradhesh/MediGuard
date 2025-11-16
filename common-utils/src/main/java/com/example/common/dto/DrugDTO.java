package com.example.common.dto;

import lombok.Data;

import java.util.List;

@Data
public class DrugDTO {

    private Long id;
    private String name;
    private String category;
    private List<String> sideEffects;

}
