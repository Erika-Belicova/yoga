package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceUnitTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private List<User> createMockUsers() {
        User user1 = User.builder()
                .id(1L)
                .email("jean@dupont.com")
                .firstName("Jean")
                .lastName("Dupont")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User user2 = User.builder()
                .id(2L)
                .email("martin@dubois.com")
                .firstName("Martin")
                .lastName("Dubois")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User user3 = User.builder()
                .id(3L)
                .email("philippe@beaumont.com")
                .firstName("Philippe")
                .lastName("Beaumont")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return new ArrayList<>(Arrays.asList(user1, user2, user3));
    }

    private Session createMockSession() {
        List<User> mockUsers = createMockUsers();

        return Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("A lovely workout session")
                .users(mockUsers)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testCreateSessionWasCreated() {
        Session mockSession = createMockSession();
        when(sessionRepository.save(eq(mockSession))).thenReturn(mockSession);
        Session result = sessionService.create(mockSession);

        assertNotNull(result);
        assertEquals("Session", result.getName());
        verify(sessionRepository).save(eq(mockSession));
    }

    @Test
    void testCreateSessionNotCreated() {
        List<User> mockUsers = createMockUsers();

        Session invalidSession = Session.builder()
                .id(1L)
                .name(null)
                .date(null)
                .description("A nice session")
                .users(mockUsers)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        verify(sessionRepository, never()).save(invalidSession);
    }

    @Test
    void testDelete() {
        sessionService.delete(1L);
        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void testFindAllSessionsExists() {
        List<User> mockUsers = createMockUsers();

        Session session1 = Session.builder()
                .id(1L)
                .name("Session 1")
                .date(new Date())
                .description("A lovely workout session")
                .users(mockUsers)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Session session2 = Session.builder()
                .id(2L)
                .name("Session 2")
                .date(new Date())
                .description("A second lovely workout session")
                .users(mockUsers)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Session session3 = Session.builder()
                .id(3L)
                .name("Session 3")
                .date(new Date())
                .description("A third lovely workout session")
                .users(mockUsers)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        List<Session> mockSessions = List.of(session1, session2, session3);

        when(sessionRepository.findAll()).thenReturn(mockSessions);
        List<Session> returnedSessions = sessionService.findAll();

        assertNotNull(returnedSessions);
        assertEquals(3, returnedSessions.size());
        assertEquals("Session 1", returnedSessions.get(0).getName());
        assertEquals("Session 2", returnedSessions.get(1).getName());
        assertEquals("Session 3", returnedSessions.get(2).getName());
    }

    @Test
    void testFindAllSessionsNotFound() {
        when(sessionRepository.findAll()).thenReturn(Collections.emptyList());
        List<Session> returnedSessions = sessionService.findAll();

        assertNotNull(returnedSessions);
        assertTrue(returnedSessions.isEmpty());
    }

    @Test
    void testGetByIdSessionExists() {
        Session mockSession = createMockSession();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        Session result = sessionService.getById(1L);

        assertNotNull(result);
        assertEquals("Session", result.getName());
        assertEquals("A lovely workout session", result.getDescription());
        assertEquals(3, result.getUsers().size());
    }

    @Test
    void testGetByIdSessionNotFound() {
        when(sessionRepository.findById(9999L)).thenReturn(Optional.empty());
        Session result = sessionService.getById(9999L);
        assertNull(result);
    }

    @Test
    void testUpdateSession() {
        Session oldSession = createMockSession();

        Session updatedSession = Session.builder()
                .id(1L)
                .name("Garden Session")
                .date(new Date())
                .description("A garden workout session")
                .users(oldSession.getUsers())
                .createdAt(oldSession.getCreatedAt())
                .updatedAt(LocalDateTime.now().plusMinutes(1))
                .build();

        when(sessionRepository.save(eq(updatedSession))).thenReturn(updatedSession);
        Session result = sessionService.update(1L, updatedSession);
        verify(sessionRepository).save(eq(updatedSession));

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Garden Session", result.getName());
        assertEquals("A garden workout session", result.getDescription());
        assertNotEquals(result.getUpdatedAt(), result.getCreatedAt());
    }

    @Test
    void testParticipateSessionNotFound() {
        when(sessionRepository.findById(9999L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.participate(9999L, 1L));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testParticipateUserNotFound() {
        when(userRepository.findById(9999L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 9999L));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testParticipateSuccess() {
        Session mockSession = createMockSession();

        User mockUser = User.builder()
                .id(4L)
                .email("anna@vert.com")
                .firstName("Anna")
                .lastName("Vert")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(sessionRepository.findById(mockSession.getId())).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        sessionService.participate(mockSession.getId(), mockUser.getId());
        verify(sessionRepository).save(eq(mockSession));

        assertTrue(mockSession.getUsers().contains(mockUser));
        assertEquals(4, mockSession.getUsers().size());
    }

    @Test
    void testUserAlreadyParticipates() {
        Session mockSession = createMockSession();
        User mockUser = mockSession.getUsers().get(0);

        when(sessionRepository.findById(mockSession.getId())).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        assertThrows(BadRequestException.class, () -> sessionService.participate(mockSession.getId(), mockUser.getId()));
        assertEquals(3, mockSession.getUsers().size());
    }

    @Test
    void testNotParticipateNoSession() {
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(9999L, 1L));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNotParticipateNoUser() {
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 9999L));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNoLongerParticipatesSuccess() {
        Session mockSession = createMockSession();
        User mockUser = mockSession.getUsers().get(0);

        when(sessionRepository.findById(mockSession.getId())).thenReturn(Optional.of(mockSession));
        sessionService.noLongerParticipate(mockSession.getId(), mockUser.getId());
        assertFalse(mockSession.getUsers().contains(mockUser));

        verify(sessionRepository).save(eq(mockSession));
        assertEquals(2, mockSession.getUsers().size());
    }
}



