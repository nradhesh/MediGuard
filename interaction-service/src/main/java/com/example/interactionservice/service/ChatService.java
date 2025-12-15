package com.example.interactionservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ChatService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String baseUrl;

    public ChatService(
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.base-url:https://api.groq.com/openai/v1}") String baseUrl
    ) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    public String analyzeDrugInteraction(String userMessage) {

        String endpoint = baseUrl + "/chat/completions";

        String requestBody = """
        {
          "model": "mixtral-8x7b-32768",
          "messages": [
            {
              "role": "system",
              "content": "You are a medical AI assistant specialized in drug interaction analysis."
            },
            {
              "role": "user",
              "content": "%s"
            }
          ],
          "max_tokens": 500,
          "temperature": 0.3
        }
        """.formatted(userMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }
}
