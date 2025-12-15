package com.example.prescription.client;

import com.example.prescription.dto.InteractionResultDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "interaction-service", url = "${interaction.service.url:}")
public interface InteractionClient {

    @GetMapping("/interactions/analyze")
    InteractionResultDTO analyze(@RequestParam("drugA") Long drugA, @RequestParam("drugB") Long drugB);
}
