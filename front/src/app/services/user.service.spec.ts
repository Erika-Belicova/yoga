import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { mockUser } from '../mocks/user.mocks';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/user/:id and return a user', () => {
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle wrong id on GET /api/user/:id', () => {
    service.getById('abc').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpTestingController.expectOne('api/user/abc');
    expect(req.request.method).toBe('GET');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 error on GET /api/user/:id when user not found', () => {
    service.getById('9999').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpTestingController.expectOne('api/user/9999');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });

  it('should call DELETE /api/user/:id and return null', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle wrong id on DELETE /api/user/:id', () => {
    service.delete('abc').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpTestingController.expectOne('api/user/abc');
    expect(req.request.method).toBe('DELETE');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 error on DELETE /api/user/:id when user not found', () => {
    service.delete('9999').subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpTestingController.expectOne('api/user/9999');
    expect(req.request.method).toBe('DELETE');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
