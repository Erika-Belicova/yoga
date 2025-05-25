import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { firstValueFrom } from 'rxjs';

import { SessionService } from './session.service';
import { mockSessionInformation } from '../mocks/session.information.mocks';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with logged out state', async () => {
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });

  it('should do login with session information and return true', async () => {
    service.logIn(mockSessionInformation);
    
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSessionInformation);

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(true);
  });

  it('should do logout and update logged state to false', async () => {
    service.logIn(mockSessionInformation);
    service.logOut();
    
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    const value = await firstValueFrom(service.$isLogged());
    expect(value).toBe(false);
  });
});
