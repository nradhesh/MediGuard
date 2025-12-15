package com.example.drugdb.controller;

import com.example.drugdb.entity.Drug;
import com.example.drugdb.repository.DrugRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DrugController.class)
public class DrugControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DrugRepository drugRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllDrugs() throws Exception {
        Drug drug1 = new Drug();
        drug1.setId(1L);
        drug1.setName("Aspirin");
        drug1.setCategory("Painkiller");
        drug1.setDosageMg(500);
        drug1.setSideEffects(Collections.singletonList("Nausea"));

        Drug drug2 = new Drug();
        drug2.setId(2L);
        drug2.setName("Ibuprofen");
        drug2.setCategory("Anti-inflammatory");
        drug2.setDosageMg(200);
        drug2.setSideEffects(Collections.singletonList("Dizziness"));

        Mockito.when(drugRepository.findAll()).thenReturn(Arrays.asList(drug1, drug2));

        mockMvc.perform(get("/drugs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Aspirin"))
                .andExpect(jsonPath("$[1].name").value("Ibuprofen"));
    }

    @Test
    public void testGetDrugById() throws Exception {
        Drug drug = new Drug();
        drug.setId(1L);
        drug.setName("Aspirin");
        drug.setCategory("Painkiller");
        drug.setDosageMg(500);
        drug.setSideEffects(Collections.singletonList("Nausea"));

        Mockito.when(drugRepository.findById(1L)).thenReturn(Optional.of(drug));

        mockMvc.perform(get("/drugs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aspirin"));
    }

    @Test
    public void testAddDrug() throws Exception {
        Drug drug = new Drug();
        drug.setName("Paracetamol");
        drug.setCategory("Painkiller");
        drug.setDosageMg(500);
        drug.setSideEffects(Collections.singletonList("None"));

        Drug savedDrug = new Drug();
        savedDrug.setId(1L);
        savedDrug.setName("Paracetamol");
        savedDrug.setCategory("Painkiller");
        savedDrug.setDosageMg(500);
        savedDrug.setSideEffects(Collections.singletonList("None"));

        Mockito.when(drugRepository.save(any(Drug.class))).thenReturn(savedDrug);

        mockMvc.perform(post("/drugs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(drug)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Paracetamol"));
    }

    @Test
    public void testDeleteDrug() throws Exception {
        Mockito.when(drugRepository.existsById(1L)).thenReturn(true);
        Mockito.doNothing().when(drugRepository).deleteById(1L);

        mockMvc.perform(delete("/drugs/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted drug with id: 1"));
    }
}
