package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

class AuthEntryPointJwtTest {

    private AuthEntryPointJwt authEntryPointJwt;

    private HttpServletRequest request;
    private AuthenticationException authException;

    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        authEntryPointJwt = new AuthEntryPointJwt();

        request = mock(HttpServletRequest.class);
        authException = mock(AuthenticationException.class);

        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Invalid token");

        response = new MockHttpServletResponse();
    }

    @Test
    void testCommenceUnauthorized() throws Exception {
        authEntryPointJwt.commence(request, response, authException);

        assertEquals(401, response.getStatus());
        assertEquals("application/json", response.getContentType());

        String jsonResponse = response.getContentAsString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> body = mapper.readValue(jsonResponse, Map.class);

        assertEquals(401, body.get("status"));
        assertEquals("Unauthorized", body.get("error"));
        assertEquals("Invalid token", body.get("message"));
        assertEquals("/api/test", body.get("path"));
    }
}
