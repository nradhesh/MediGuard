package com.example.interactionservice.client;

import com.example.interactionservice.dto.DrugDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "drug-database-service", url = "${drug.service.url:}")
public interface DrugClient {

    @GetMapping("/drugs/{id}")
    DrugDTO getDrug(@PathVariable("id") Long id);

    @GetMapping("/drugs")
    List<DrugDTO> getAllDrugs();
}
