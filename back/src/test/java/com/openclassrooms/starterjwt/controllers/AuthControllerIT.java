package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
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
public class AuthControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    @Test
    public void testRegisterSuccess() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("claire@studio.com");
        signupRequest.setFirstName("Claire");
        signupRequest.setLastName("Perret");
        signupRequest.setPassword("password");

        String signUpRequestJson = objectMapper.writeValueAsString(signupRequest);

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
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("yoga@studio.com");
        signupRequest.setFirstName("Claire");
        signupRequest.setLastName("Perret");
        signupRequest.setPassword("password");

        String signUpRequestJson = objectMapper.writeValueAsString(signupRequest);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpRequestJson))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Transactional
    @Test
    public void testLoginWithUser() throws Exception {
        User user = new User();
        user.setFirstName("Claire");
        user.setLastName("Perret");
        user.setEmail("claire@perret.com");
        user.setPassword(passwordEncoder.encode("password"));
        user.setAdmin(false);
        user = userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("claire@perret.com");
        loginRequest.setPassword("password");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("claire@perret.com"))
                .andExpect(jsonPath("$.firstName").value("Claire"))
                .andExpect(jsonPath("$.lastName").value("Perret"))
                .andExpect(jsonPath("$.admin").value(false));
    }

    @Transactional
    @Test
    public void testLoginBadCredentials() throws Exception {
        User user = new User();
        user.setFirstName("Claire");
        user.setLastName("Perret");
        user.setEmail("claire@perret.com");
        user.setPassword("password");
        user.setAdmin(false);
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("claire@perret.com");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}