package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
public class UserServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testFindByIdUserExists() {
        User mockUser = User.builder()
                .id(1L)
                .email("jean@dupont.com")
                .firstName("Jean")
                .lastName("Dupont")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        User result = userService.findById(1L);

        assertNotNull(result);
        assertEquals("Jean", result.getFirstName());
        assertEquals("Dupont", result.getLastName());
    }

    @Test
    void testFindByIdUserNotFound() {
        when(userRepository.findById(9999L)).thenReturn(Optional.empty());
        User result = userService.findById(9999L);
        assertNull(result);
    }

    @Test
    void testDelete() {
        userService.delete(1L);
        verify(userRepository).deleteById(1L);
    }
}
