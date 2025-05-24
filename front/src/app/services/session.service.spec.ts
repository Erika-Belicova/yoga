import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { SessionService } from './session.service';
import { firstValueFrom } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initial state should be false or undefined', async () => {
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });

  it('should do login with mockSessionInformation and return true', async () => {
    const mockSessionInformation: SessionInformation = { 
      token: 'token',
      type: 'type',
      id: 1,
      username: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      admin: false
    };

    service.logIn(mockSessionInformation);
    
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSessionInformation);

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(true);
  });

  it('should do logout with mockSessionInformation and return false for $isLogged', async () => {
    const mockSessionInformation: SessionInformation = { 
      token: 'token',
      type: 'type',
      id: 1,
      username: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      admin: false
    };

    service.logIn(mockSessionInformation);
    service.logOut();
    
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });
});
