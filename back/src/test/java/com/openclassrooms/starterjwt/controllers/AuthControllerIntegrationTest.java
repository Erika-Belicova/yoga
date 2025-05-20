package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

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


    @Transactional
    @Test
    public void testLoginWithUser() throws Exception {
        User user = new User();
        user.setFirstName("Claire");
        user.setLastName("Perret");
        user.setEmail("claire@studio.com");
        user.setPassword(passwordEncoder.encode("password"));
        user.setAdmin(false);
        user = userRepository.save(user);

        String loginRequestJson = "{ \"email\": \"claire@studio.com\", \"password\": \"password\" }";

      /*  Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
*/
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andDo(print())
                .andExpect(status().isOk())
              //  .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("claire@studio.com"))
                .andExpect(jsonPath("$.firstName").value("Claire"))
                .andExpect(jsonPath("$.lastName").value("Perret"))
                .andExpect(jsonPath("$.admin").value(false));
    }


    /*
    @Transactional
    @Test
    public void testLoginBadCredentials() throws Exception {
        User user = new User();
        user.setFirstName("Yoga");
        user.setLastName("Studio");
        user.setEmail("yoga2@studio.com");
        user.setPassword("password");
        user.setAdmin(false);
        userRepository.save(user);

        String loginRequestJson = "{ \"email\": \"yoga2@studio.com\", \"password\": \"wrongpassword\" }";

        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("yoga2@studio.com", "wrongpassword")
        )).thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
    */
}
