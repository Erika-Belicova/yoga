import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { mockSessionInformation } from '../../../mocks/session.information.mocks';
import { mockRegisterRequest, mockLoginRequest } from '../../../mocks/auth.mocks';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /api/auth/register with RegisterRequest and return void', () => {
    service.register(mockRegisterRequest).subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should handle bad request error on POST /api/auth/register', () => {
    service.register(mockRegisterRequest).subscribe({
      next: () => {
        throw new Error('Expected error, but got success');
      },
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should call POST /api/auth/login with LoginRequest and return SessionInformation', () => {
    service.login(mockLoginRequest).subscribe((result) => {
    expect(result).toEqual(mockSessionInformation);
    });

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockSessionInformation);
  });

  it('should handle an unauthorized error on POST /api/auth/login with wrong credentials', () => {
    service.login(mockLoginRequest).subscribe({
      next: () => {
        throw new Error('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    });

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });
});
