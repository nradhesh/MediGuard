package com.example.prescription;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class PrescriptionServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(PrescriptionServiceApplication.class, args);
		System.out.println("Prescription Service running...");
	}
}