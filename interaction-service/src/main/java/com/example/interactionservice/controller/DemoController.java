package com.example.interactionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/demo/intro")
    public String intro() {
        return "Interaction Service: demo endpoints available at /interactions/analyze";
    }

    @GetMapping("/demo/features")
    public String features() {
        return "Features: rule engine, side-effect overlap, category conflict, combined dosage checks, severity scoring.";
    }
}
