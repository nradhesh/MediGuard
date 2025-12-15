package com.example.interactionservice.controller;

import com.example.interactionservice.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interactions")   // <--- base path
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")          // <--- full path: /interactions/chat
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ChatResponse("Please provide a message."));
            }

            String reply = chatService.analyzeDrugInteraction(request.getMessage().trim());
            return ResponseEntity.ok(new ChatResponse(reply));

        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();

            // Handle quota / rate-limit errors
            if (errorMessage != null &&
                    (errorMessage.contains("quota")
                            || errorMessage.contains("billing")
                            || errorMessage.contains("429"))) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(new ChatResponse(
                                "The AI service is currently unavailable due to quota limits. " +
                                        "Please try again later or contact support."
                        ));
            }

            // Handle generic API errors (Groq/OpenAI-like)
            if (errorMessage != null &&
                    (errorMessage.contains("Groq")
                            || errorMessage.contains("OpenAI")
                            || errorMessage.contains("API"))) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(new ChatResponse(
                                "The AI service is temporarily unavailable. Please try again later."
                        ));
            }

            // Fallback generic error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse(
                            "An error occurred while processing your request. Please try again later."
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse(
                            "An unexpected error occurred. Please try again later."
                    ));
        }
    }

    // ---- DTOs ----

    public static class ChatRequest {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class ChatResponse {
        private String response;

        public ChatResponse() {
        }

        public ChatResponse(String response) {
            this.response = response;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
    }
}
