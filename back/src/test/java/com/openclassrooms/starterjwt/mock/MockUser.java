package com.openclassrooms.starterjwt.mock;

import com.openclassrooms.starterjwt.models.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MockUser {

    public static User buildUserFindById() {
        return User.builder()
                .id(1L)
                .email("jean@dupont.com")
                .firstName("Jean")
                .lastName("Dupont")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static User buildUserSessionParticipation() {
        return User.builder()
                .id(4L)
                .email("anna@vert.com")
                .firstName("Anna")
                .lastName("Vert")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static List<User> buildUsersForSession() {
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
}
