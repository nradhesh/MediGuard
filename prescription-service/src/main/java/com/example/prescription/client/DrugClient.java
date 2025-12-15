package com.example.prescription.client;

import com.example.prescription.dto.DrugDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "drug-database-service", url = "${drug.service.url:}")
public interface DrugClient {
    @GetMapping("/drugs/{id}")
    DrugDTO getDrug(@PathVariable("id") Long id);
}
