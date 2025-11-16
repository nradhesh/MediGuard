package com.example.common.dto;

import lombok.Data;

import java.util.List;

@Data
public class PrescriptionRequestDTO {

    private String patientId;
    private List<String> drugNames;

}
