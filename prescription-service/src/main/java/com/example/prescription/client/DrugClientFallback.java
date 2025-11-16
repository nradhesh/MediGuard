package com.example.prescription.client;

import com.example.prescription.dto.DrugDTO;
import org.springframework.stereotype.Component;

@Component
public class DrugClientFallback implements DrugClient {
    @Override
    public DrugDTO getDrug(Long id) {
        // Simple fallback: return minimal info indicating remote failure
        DrugDTO d = new DrugDTO();
        d.setId(id);
        d.setName("UNKNOWN");
        return d;
    }
}
