package com.openclassrooms.starterjwt.mock;

import com.openclassrooms.starterjwt.models.Teacher;

import java.time.LocalDateTime;
import java.util.List;

public class MockTeacher {

    public static Teacher buildTeacherFindById() {
        return Teacher.builder()
                .id(1L)
                .firstName("Jean")
                .lastName("Dupont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static List<Teacher> buildTeacherListForFindAll() {
        Teacher teacher1 = Teacher.builder()
                .id(1L)
                .firstName("Jean")
                .lastName("Dupont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Teacher teacher2 = Teacher.builder()
                .id(2L)
                .firstName("Martin")
                .lastName("Dubois")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Teacher teacher3 = Teacher.builder()
                .id(3L)
                .firstName("Philippe")
                .lastName("Beaumont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return List.of(teacher1, teacher2, teacher3);
    }
}
