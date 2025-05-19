package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SessionControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUpSession() {
        Session session = new Session();
        session.setName("Session");
        session.setDescription("Description");
        session.setDate(Timestamp.from(Instant.now()));
        sessionRepository.save(session);
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindAllSessions() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindSessionById() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Session"))
                .andExpect(jsonPath("$.description").value("Description"));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindSessionByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 9999L))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.id").doesNotExist())
                .andExpect(jsonPath("$.name").doesNotExist())
                .andExpect(jsonPath("$.description").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testFindSessionByIdInvalidId() throws Exception {
        mockMvc.perform(get("/api/session/{id}", "xyz"))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.id").doesNotExist())
                .andExpect(jsonPath("$.name").doesNotExist())
                .andExpect(jsonPath("$.description").doesNotExist());
    }

    @Transactional
    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testCreateSessionSuccess() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Session");
        sessionDto.setDescription("New session description");
        sessionDto.setDate(Timestamp.from(Instant.parse("2025-08-26T12:00:00Z")));
        sessionDto.setTeacher_id(1L);

        String sessionRequestJson = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(post("/api/session")
                        .contentType("application/json")
                        .content(sessionRequestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Session"))
                .andExpect(jsonPath("$.description").value("New session description"))
                .andExpect(jsonPath("$.date").value("2025-08-26T12:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1));
    }

    @Transactional
    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testUpdateSessionSuccess() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDescription("Updated description");
        sessionDto.setDate(Timestamp.from(Instant.parse("2025-08-26T12:00:00Z")));
        sessionDto.setTeacher_id(1L);

        String sessionUpdateJson = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(put("/api/session/{id}", 1L)
                        .contentType("application/json")
                        .content(sessionUpdateJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.date").value("2025-08-26T12:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testUpdateSessionInvalidId() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Invalid Session");
        sessionDto.setDescription("Invalid session id");
        sessionDto.setDate(Timestamp.from(Instant.parse("2025-08-26T12:00:00Z")));
        sessionDto.setTeacher_id(1L);

        String sessionUpdateJson = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(put("/api/session/{id}", "abc")
                        .contentType("application/json")
                        .content(sessionUpdateJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Transactional
    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteSessionSuccess() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteSessionNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", 9999L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testDeleteSessionInvalidId() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", "abc"))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testParticipateSuccess() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1L, 1L))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testParticipateInvalidSessionId() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", "abc", 1L))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testParticipateNoSession() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", 9999L, 1L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testParticipateInvalidUserId() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1L, "xyz"))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testParticipateNoUser() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1L, 9999L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testNoLongerParticipSuccess() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 1L, 1L))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testNoLongerParticipWrongSession() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", "abc", 1L))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testNoLongerParticipNoSession() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 9999L, 1L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testNoLongerParticipWrongUser() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 1L, "xyz"))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void testNoLongerParticipNoUser() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 1L, 9999L))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}