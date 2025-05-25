import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { mockTeacher, mockTeachers } from '../mocks/teacher.mocks';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(TeacherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/teacher and return all teachers', () => {
    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpTestingController.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should call GET /api/teacher/:id and return mockTeacher', () => {
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpTestingController.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });

  it('should handle wrong id on GET /api/teacher/:id', () => {
    service.detail('abc').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpTestingController.expectOne('api/teacher/abc');
    expect(req.request.method).toBe('GET');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 error on GET /api/teacher/:id when teacher not found', () => {
    service.detail('9999').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpTestingController.expectOne('api/teacher/9999');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});