package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mock.MockSession;
import com.openclassrooms.starterjwt.mock.MockUser;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @Test
    void testCreateSessionWasCreated() {
        Session mockSession = MockSession.createSessionWithUsers();
        when(sessionRepository.save(eq(mockSession))).thenReturn(mockSession);
        Session result = sessionService.create(mockSession);

        assertNotNull(result);
        assertEquals("Session", result.getName());
        verify(sessionRepository).save(eq(mockSession));
    }

    @Test
    void testDelete() {
        sessionService.delete(1L);
        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void testFindAllSessionsExists() {
        List<Session> mockSessions = MockSession.sessionsForFindAll();
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
        Session mockSession = MockSession.createSessionWithUsers();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        Session result = sessionService.getById(1L);

        assertNotNull(result);
        assertEquals("Session", result.getName());
        assertEquals("A workout session", result.getDescription());
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
        Session oldSessionData = MockSession.createSessionWithUsers();
        Session updatedSession = MockSession.updatedSession(oldSessionData);

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
        Session mockSession = MockSession.createSessionWithUsers();
        User mockUser = MockUser.buildUserSessionParticipation();

        when(sessionRepository.findById(mockSession.getId())).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        sessionService.participate(mockSession.getId(), mockUser.getId());
        verify(sessionRepository).save(eq(mockSession));

        assertTrue(mockSession.getUsers().contains(mockUser));
        assertEquals(4, mockSession.getUsers().size());
    }

    @Test
    void testUserAlreadyParticipates() {
        Session mockSession = MockSession.createSessionWithUsers();
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
        Session mockSession = MockSession.createSessionWithUsers();
        User mockUser = mockSession.getUsers().get(0);

        when(sessionRepository.findById(mockSession.getId())).thenReturn(Optional.of(mockSession));
        sessionService.noLongerParticipate(mockSession.getId(), mockUser.getId());
        assertFalse(mockSession.getUsers().contains(mockUser));

        verify(sessionRepository).save(eq(mockSession));
        assertEquals(2, mockSession.getUsers().size());
    }
}



