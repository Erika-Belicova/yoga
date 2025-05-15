package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class SecurityJwtApplicationMainTest {

    @Test
    void testApplicationStartsSuccess() {
        try (ConfigurableApplicationContext context =
                     SpringApplication.run(SpringBootSecurityJwtApplication.class)) {
            assertNotNull(context);
        }
    }

    @Test
    void testMainMethodDoesNotThrow() {
        assertDoesNotThrow(() -> SpringBootSecurityJwtApplication.main(new String[]{}));
    }
}
