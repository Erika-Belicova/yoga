import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /api/auth/register with RegisterRequest and return void', () => {
    const mockRegisterRequest: RegisterRequest = { 
      email: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      password: 'password'
    };

    const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of(undefined));

    service.register(mockRegisterRequest).subscribe((result) => {
      expect(result).toBeUndefined();
    });

    expect(httpPostSpy).toHaveBeenCalledWith('api/auth/register', mockRegisterRequest);
  });

  it('should call POST /api/auth/login with LoginRequest and return SessionInformation', () => {
    const mockLoginRequest: LoginRequest = { 
      email: 'claire@perret.com',
      password: 'password'
    };

    const mockSessionInformation: SessionInformation = {
      token: 'token',
      type: 'type',
      id: 1,
      username: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      admin: false
    };

    const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of(mockSessionInformation));

    service.login(mockLoginRequest).subscribe((result) => {
    expect(result).toEqual(mockSessionInformation);
    });

    expect(httpPostSpy).toHaveBeenCalledWith('api/auth/login', mockLoginRequest);
  });
});
