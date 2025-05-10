package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindUserById() throws Exception {
        mockMvc.perform(get("/api/user/{id}", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Admin"))
                .andExpect(jsonPath("$.lastName").value("Admin"))
                .andExpect(jsonPath("$.email").value("yoga@studio.com"));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindUserByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/user/{id}", 9999L))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.id").doesNotExist())
                .andExpect(jsonPath("$.firstName").doesNotExist())
                .andExpect(jsonPath("$.lastName").doesNotExist())
                .andExpect(jsonPath("$.email").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindUserByIdInvalidId() throws Exception {
        mockMvc.perform(get("/api/user/{id}", "xyz"))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.id").doesNotExist())
                .andExpect(jsonPath("$.firstName").doesNotExist())
                .andExpect(jsonPath("$.lastName").doesNotExist())
                .andExpect(jsonPath("$.email").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteUserBadRequest() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", "xyz"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteUserNotFound() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteUserUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", 1L))
                .andExpect(status().isUnauthorized());
    }
}
