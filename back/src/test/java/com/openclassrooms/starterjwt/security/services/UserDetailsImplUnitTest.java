package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplUnitTest {

    @Test
    void testEqualsSameObjectExpectedTrue() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .firstName("Thomas")
                .lastName("Martin")
                .admin(false)
                .password("password")
                .build();

        assertEquals(user, user);
    }

    @Test
    void testEqualsNullExpectedFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .build();

        assertNotEquals(null, user);
    }

    @Test
    void testEqualsDiffClassExpectedFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        assertNotEquals("not a UserDetailsImpl", user);
    }


    @Test
    void testEqualsDiffIdExpectedFalse() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();

        assertNotEquals(user1, user2);
    }

    @Test
    void testEqualsSameIdExpectedTrue() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        assertEquals(user1, user2);
    }

    @Test
    void testEqualsBothNullIdExpectedTrue() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(null).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(null).build();

        assertEquals(user1, user2);
    }

    @Test
    void testEqualsOneNullIdExpectedFalse() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(null).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        assertNotEquals(user1, user2);
    }

    @Test
    void testOtherObjectNullExpectedFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        assertNotEquals(null, user);
    }

    @Test
    void testOtherObjectDiffTypeExpFalse() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        Object other = new Object();
        assertNotEquals(user, other);
    }

    @Test
    void testIdsAndClassAreSameExpTrue() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
        assertEquals(user1, user2);
    }
}
