import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  it('should call GET /api/user/:id and return a user', () => {
    const mockUser: User = { 
      id: 1, 
      email: 'anna@perret.com', 
      lastName: 'Perret', 
      firstName: 'Anna', 
      admin: false, 
      password: 'password', 
      createdAt: new Date()
    };

    const httpGetSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockUser));

    service.getById('1').subscribe((result) => {
      expect(result).toEqual(mockUser);
    });

    expect(httpGetSpy).toHaveBeenCalledWith('api/user/1');
  });

  it('should call DELETE /api/user/:id and return null', () => {
    const httpDeleteSpy = jest.spyOn(httpClient, 'delete').mockReturnValue(of(null));

    service.delete('1').subscribe((result) => {
      expect(result).toBeNull();
    });

    expect(httpDeleteSpy).toHaveBeenCalledWith('api/user/1');
  });
});
