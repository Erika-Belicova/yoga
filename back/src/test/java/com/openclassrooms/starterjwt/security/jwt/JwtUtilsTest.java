package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Date;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private final String testSecret = "test secret token";
    private final int testExpirationMs = 60 * 60 * 1000; // 1 hour

    @BeforeEach
    void setUp() throws Exception {
        jwtUtils = new JwtUtils();

        // Inject test values into private fields that Spring normally sets via @Value
        Field secretJwtField = JwtUtils.class.getDeclaredField("jwtSecret");
        secretJwtField.setAccessible(true);
        secretJwtField.set(jwtUtils, testSecret);

        Field expirationJwtField = JwtUtils.class.getDeclaredField("jwtExpirationMs");
        expirationJwtField.setAccessible(true);
        expirationJwtField.setInt(jwtUtils, testExpirationMs);
    }

    @Test
    void testGetUsernameFromJwtSuccess() {
        String token = Jwts.builder()
                .setSubject("jean@dupont.com")
                .setExpiration(new Date(System.currentTimeMillis() + testExpirationMs))
                .signWith(SignatureAlgorithm.HS512, testSecret)
                .compact();

        String extractedUsername = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("jean@dupont.com", extractedUsername);
    }

    @Test
    void testValidateJwtSuccess() {
        String validToken = Jwts.builder()
                .setSubject("jean@dupont.com")
                .setExpiration(new Date(System.currentTimeMillis() + testExpirationMs))
                .signWith(SignatureAlgorithm.HS512, testSecret)
                .compact();

        assertTrue(jwtUtils.validateJwtToken(validToken));
    }

    @Test
    void testValidateJwtInvalidToken() {
        String invalidToken = "test invalid token";
        assertFalse(jwtUtils.validateJwtToken(invalidToken));
    }

    @Test
    void testValidateJwtExpiredToken() {
        Instant now = Instant.now();
        Date issuedAt = Date.from(now.minusSeconds(10));
        Date expiration = Date.from(now.minusSeconds(5));

        String expiredToken = Jwts.builder()
                .setSubject("jean@dupont.com")
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS512, testSecret)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(expiredToken));
    }

    @Test
    void testValidateJwtEmptyToken() {
        String emptyToken = "";
        assertFalse(jwtUtils.validateJwtToken(emptyToken));
    }
}
