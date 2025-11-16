package com.example.interactionservice.controller;

import com.example.interactionservice.dto.InteractionResultDTO;
import com.example.interactionservice.service.InteractionEngine;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InteractionController {

    private final InteractionEngine engine;

    public InteractionController(InteractionEngine engine) {
        this.engine = engine;
    }

    /**
     * Example: GET /interactions/analyze?drugA=1&drugB=2
     */
    @GetMapping("/interactions/analyze")
    public InteractionResultDTO analyze(
            @RequestParam("drugA") Long drugA,
            @RequestParam("drugB") Long drugB
    ) {
        return engine.analyze(drugA, drugB);
    }
}
