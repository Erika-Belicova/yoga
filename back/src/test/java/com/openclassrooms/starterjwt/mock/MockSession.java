package com.openclassrooms.starterjwt.mock;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class MockSession {

    public static Session createSessionWithUsers() {
        List<User> users = MockUser.buildUsersForSession();
        return Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("A workout session")
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static List<Session> sessionsForFindAll() {
        List<User> users = MockUser.buildUsersForSession();

        Session session1 = Session.builder()
                .id(1L)
                .name("Session 1")
                .date(new Date())
                .description("First session")
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Session session2 = Session.builder()
                .id(2L)
                .name("Session 2")
                .date(new Date())
                .description("Second session")
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Session session3 = Session.builder()
                .id(3L)
                .name("Session 3")
                .date(new Date())
                .description("Third session")
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return List.of(session1, session2, session3);
    }

    public static Session updatedSession(Session oldSessionData) {
        return Session.builder()
                .id(oldSessionData.getId())
                .name("Garden Session")
                .date(new Date())
                .description("A garden workout session")
                .users(oldSessionData.getUsers())
                .createdAt(oldSessionData.getCreatedAt())
                .updatedAt(LocalDateTime.now().plusMinutes(1))
                .build();
    }
}
