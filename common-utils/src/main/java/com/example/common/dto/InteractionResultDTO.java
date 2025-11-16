package com.example.common.dto;

import com.example.common.enums.SeverityLevel;
import lombok.Data;

@Data
public class InteractionResultDTO {

    private boolean safe;
    private String message;
    private SeverityLevel severity;

}
