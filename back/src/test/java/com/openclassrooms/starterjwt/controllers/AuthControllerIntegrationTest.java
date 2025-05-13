package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Test
    public void testRegisterSuccess() throws Exception {
        String signUpRequestJson = "{ \"email\": \"claire@studio.com\", \"firstName\": \"Claire\", \"lastName\": \"Perret\", \"admin\": false, \"password\": \"password\" }";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpRequestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

        Optional<User> registeredUser = userRepository.findByEmail("claire@studio.com");

        registeredUser.ifPresent(user -> {
            assertThat(user.getEmail()).isEqualTo("claire@studio.com");
            assertThat(user.getFirstName()).isEqualTo("Claire");
            assertThat(user.getLastName()).isEqualTo("Perret");
            assertThat(passwordEncoder.matches("password", user.getPassword())).isTrue();
        });
    }

    @Transactional
    @Test
    public void testRegisterEmailAlreadyTaken() throws Exception {
        String signUpRequestJson = "{ \"email\": \"yoga@studio.com\", \"firstName\": \"Claire\", \"lastName\": \"Perret\", \"admin\": false, \"password\": \"password\" }";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpRequestJson))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }
}
