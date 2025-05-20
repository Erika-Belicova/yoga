package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplUnitTest {

    private UserDetailsImpl createUser(Long id, Boolean admin) {
        return UserDetailsImpl.builder()
                .id(id)
                .username("thomas@martin.com")
                .firstName("Thomas")
                .lastName("Martin")
                .password("password")
                .admin(admin)
                .build();
    }

    @Test
    void testEqualsSameObjectExpectedTrue() {
        UserDetailsImpl user = createUser(1L, false);
        assertEquals(user, user);
    }

    @Test
    void testEqualsNullExpectedFalse() {
        UserDetailsImpl user = createUser(1L, false);
        assertNotEquals(null, user);
    }

    @Test
    void testEqualsDiffClassExpectedFalse() {
        UserDetailsImpl user = createUser(1L, false);
        assertNotEquals("not a UserDetailsImpl", user);
    }

    @Test
    void testEqualsDiffIdExpectedFalse() {
        UserDetailsImpl user1 = createUser(1L, false);
        UserDetailsImpl user2 = createUser(2L, false);
        assertNotEquals(user1, user2);
    }

    @Test
    void testEqualsSameIdExpectedTrue() {
        UserDetailsImpl user1 = createUser(1L, false);
        UserDetailsImpl user2 = createUser(1L, true);
        assertEquals(user1, user2);
    }

    @Test
    void testEqualsBothNullIdExpectedTrue() {
        UserDetailsImpl user1 = createUser(null, false);
        UserDetailsImpl user2 = createUser(null, true);
        assertEquals(user1, user2);
    }

    @Test
    void testEqualsOneNullIdExpectedFalse() {
        UserDetailsImpl user1 = createUser(null, false);
        UserDetailsImpl user2 = createUser(1L, true);
        assertNotEquals(user1, user2);
    }

    @Test
    void testOtherObjectNullExpectedFalse() {
        UserDetailsImpl user = createUser(1L, false);
        assertNotEquals(null, user);
    }

    @Test
    void testOtherObjectDiffTypeExpFalse() {
        UserDetailsImpl user = createUser(1L, false);
        Object other = new Object();
        assertNotEquals(user, other);
    }

    @Test
    void testIdsAndClassAreSameExpTrue() {
        UserDetailsImpl user1 = createUser(1L, false);
        UserDetailsImpl user2 = createUser(1L, false);
        assertEquals(user1, user2);
    }

    @Test
    void testAdminField() {
        UserDetailsImpl userWithAdminTrue = createUser(1L, true);
        UserDetailsImpl userWithAdminFalse = createUser(2L, false);

        assertTrue(userWithAdminTrue.getAdmin());
        assertFalse(userWithAdminFalse.getAdmin());
    }
}
