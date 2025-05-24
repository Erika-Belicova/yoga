import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/session and return all sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Session 1',
        description: 'A session description 1',
        date: new Date(),
        teacher_id: 1,
        users: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Session 2',
        description: 'A session description 2',
        date: new Date(),
        teacher_id: 1,
        users: [3, 4],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Session 3',
        description: 'A session description 3',
        date: new Date(),
        teacher_id: 1,
        users: [5, 6],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const httpGetSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockSessions));

    service.all().subscribe((result) => {
      expect(result).toEqual(mockSessions);
    });

    expect(httpGetSpy).toHaveBeenCalledWith('api/session');
  });
  
  it('should call GET /api/session/:id and return mockSession', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Session',
      description: 'A session description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const httpGetSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockSession));

    service.detail('1').subscribe((result) => {
      expect(result).toEqual(mockSession);
    });

    expect(httpGetSpy).toHaveBeenCalledWith('api/session/1');
  });

  it('should call DELETE /api/session/:id and return null', () => {
    const httpDeleteSpy = jest.spyOn(httpClient, 'delete').mockReturnValue(of(null));

    service.delete('1').subscribe((result) => {
      expect(result).toBeNull();
    });

    expect(httpDeleteSpy).toHaveBeenCalledWith('api/session/1');
  });

  it('should DELETE /api/session/:id a non-existent session and return an error', async () => {
    const error = new Error('Delete failed');
    jest.spyOn(httpClient, 'delete').mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.delete('9999'))).rejects.toBe(error);

    expect(httpClient.delete).toHaveBeenCalledWith('api/session/9999');
  });

  it('should call POST /api/session and create a session', () => {
    const mockSession: Session = { 
      id: 1,
      name: 'Session',
      description: 'A session description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of(mockSession));

    service.create(mockSession).subscribe((result) => {
      expect(result).toEqual(mockSession);
    });

    expect(httpPostSpy).toHaveBeenCalledWith('api/session', mockSession);
  });

  it('should call PUT /api/session/:id and update a session', () => {
  const mockSession: Session = { 
      id: 1,
      name: 'Session',
      description: 'A different session description',
      date: new Date(),
      teacher_id: 1,
      users: [2, 3],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const httpPutSpy = jest.spyOn(httpClient, 'put').mockReturnValue(of(mockSession));

    service.update('1', mockSession).subscribe((result) => {
      expect(result).toEqual(mockSession);
    });

    expect(httpPutSpy).toHaveBeenCalledWith('api/session/1', mockSession);
  });

  it('should call POST /api/session/:id/participate/:userId and add a user to a session', () => {
    const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of(undefined));

    service.participate('1', '3').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    expect(httpPostSpy).toHaveBeenCalledWith('api/session/1/participate/3', null);
  });

  it('should call DELETE /api/session/:id/participate/:userId and delete a user from a session', () => {
    const httpDeleteSpy = jest.spyOn(httpClient, 'delete').mockReturnValue(of(null));

    service.unParticipate('1','3').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    expect(httpDeleteSpy).toHaveBeenCalledWith('api/session/1/participate/3');
  });
});
