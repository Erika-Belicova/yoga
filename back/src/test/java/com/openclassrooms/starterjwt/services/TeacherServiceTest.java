package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.mock.MockTeacher;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void testFindByIdTeacherExists() {
        Teacher mockTeacher = MockTeacher.buildTeacherFindById();
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
        List<Teacher> mockTeachers = MockTeacher.buildTeacherListForFindAll();
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
