package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceUnitTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void testFindByIdTeacherExists() {
        Teacher mockTeacher = Teacher.builder()
                .id(1L)
                .firstName("Jean")
                .lastName("Dupont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(mockTeacher));
        Teacher result = teacherService.findById(1L);

        assertNotNull(result);
        assertEquals("Jean", result.getFirstName());
        assertEquals("Dupont", result.getLastName());
    }

    @Test
    void testFindByIdTeacherNotFound() {
        when(teacherRepository.findById(9999L)).thenReturn(Optional.empty());
        Teacher result = teacherService.findById(9999L);
        assertNull(result);
    }

    @Test
    void testFindAllTeachersExists() {
        Teacher teacher1 = Teacher.builder()
                .id(1L).firstName("Jean")
                .lastName("Dupont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now()).build();

        Teacher teacher2 = Teacher.builder()
                .id(2L).firstName("Martin")
                .lastName("Dubois")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Teacher teacher3 = Teacher.builder()
                .id(3L).firstName("Philippe")
                .lastName("Beaumont")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        List<Teacher> mockTeachers = List.of(teacher1, teacher2, teacher3);
        when(teacherRepository.findAll()).thenReturn(mockTeachers);
        List<Teacher> returnedTeachers = teacherService.findAll();

        assertNotNull(returnedTeachers);
        assertEquals(3, returnedTeachers.size());
        assertEquals("Dupont", returnedTeachers.get(0).getLastName());
        assertEquals("Dubois", returnedTeachers.get(1).getLastName());
        assertEquals("Beaumont", returnedTeachers.get(2).getLastName());
    }

    @Test
    void testFindAllTeachersNotFound() {
        when(teacherRepository.findAll()).thenReturn(Collections.emptyList());
        List<Teacher> returnedTeachers = teacherService.findAll();

        assertNotNull(returnedTeachers);
        assertTrue(returnedTeachers.isEmpty());
    }
}
