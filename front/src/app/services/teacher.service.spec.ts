import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(TeacherService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/teacher and return all teachers', () => {
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        lastName: 'Jean',
        firstName: 'Dupont',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        lastName: 'Thomas',
        firstName: 'Martin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        lastName: 'Claire',
        firstName: 'Beaumont',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    const httpGetSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeachers));

    service.all().subscribe((result) => {
      expect(result).toEqual(mockTeachers);
    });

    expect(httpGetSpy).toHaveBeenCalledWith('api/teacher');
  });

  it('should call GET /api/teacher/:id and return mockTeacher', () => {
    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'Jean',
      firstName: 'Dupont',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpGetSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeacher));

    service.detail('1').subscribe((result) => {
      expect(result).toEqual(mockTeacher);
    });

    expect(httpGetSpy).toHaveBeenCalledWith('api/teacher/1');
  });
});
