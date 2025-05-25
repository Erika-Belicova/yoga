import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { mockSession, mockSessions } from '../../../mocks/session.mocks';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    
    service = TestBed.inject(SessionApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // test for method : all()
  describe('method: all()', () => {
    it('should call GET /api/session and return all sessions', () => {
      service.all().subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
      });

      const req = httpTestingController.expectOne('api/session');
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });
  
  // tests for method: detail(id: string)
  describe('method: detail(id: string)', () => {
    it('should call GET /api/session/:id and return mockSession', () => {
      service.detail('1').subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      const req = httpTestingController.expectOne('api/session/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSession);
    });

    it('should handle wrong id on GET /api/session/:id', () => {
      service.detail('abc').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpTestingController.expectOne('api/session/abc');
      expect(req.request.method).toBe('GET');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 404 error on GET /api/session/:id when session not found', () => {
      service.detail('9999').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/9999');
      expect(req.request.method).toBe('GET');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // tests for method: delete(id: string)
  describe('method: delete(id: string)', () => {
    it('should call DELETE /api/session/:id and return null', () => {
      service.delete('1').subscribe((result) => {
        expect(result).toBeNull();
      });

      const req = httpTestingController.expectOne('api/session/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle wrong id on DELETE /api/session/:id', () => {
      service.delete('abc').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpTestingController.expectOne('api/session/abc');
      expect(req.request.method).toBe('DELETE');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 404 error on DELETE /api/session/:id when session not found', () => {
      service.delete('9999').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/9999');
      expect(req.request.method).toBe('DELETE');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // tests for method: create(session: Session)
  describe('method: create(session: Session)', () => {
    it('should call POST /api/session and create a session', () => {
      service.create(mockSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      const req = httpTestingController.expectOne('api/session');
      expect(req.request.method).toBe('POST');
      req.flush(mockSession);
    });

    it('should handle a bad request error on POST /api/session', () => {
      service.create(mockSession).subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpTestingController.expectOne('api/session');
      expect(req.request.method).toBe('POST');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  // tests for method: update(id: string, session: Session)
  describe('method: update(id: string, session: Session)', () => {
    it('should call PUT /api/session/:id and update a session', () => {
      service.update('1', mockSession).subscribe((result) => {
        expect(result).toEqual(mockSession);
      });

      const req = httpTestingController.expectOne('api/session/1');
      expect(req.request.method).toBe('PUT');
      req.flush(mockSession);
    });

    it('should handle a session not found error on PUT /api/session/:id', () => {
      service.update('1', mockSession).subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne('api/session/1');
      expect(req.request.method).toBe('PUT');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  // tests for method: participate(id: string, userId: string)
  describe('method: participate(id: string, userId: string)', () => {
    it('should call POST /api/session/:id/participate/:userId and add a user to a session', () => {
      service.participate('1', '3').subscribe((result) => {
        expect(result).toBeUndefined();
      });

      const req = httpTestingController.expectOne('api/session/1/participate/3');
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should handle a bad request error on POST /api/session/:id/participate/:userId with wrong userId', () => {
      service.participate('1', 'abc').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpTestingController.expectOne('api/session/1/participate/abc');
      expect(req.request.method).toBe('POST');
      req.flush('Invalid user ID', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle a session not found error on POST /api/session/:id/participate/:userId', () => {
      service.participate('9999', '3').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/9999/participate/3');
      expect(req.request.method).toBe('POST');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle a user not found error on POST /api/session/:id/participate/:userId', () => {
      service.participate('1', '9999').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/1/participate/9999');
      expect(req.request.method).toBe('POST');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // tests for method: unParticipate(id: string, userId: string)
  describe('method: unParticipate(id: string, userId: string)', () => {
    it('should call DELETE /api/session/:id/participate/:userId and delete a user from a session', () => {
      service.unParticipate('1','3').subscribe((result) => {
        expect(result).toBeUndefined();
      });

      const req = httpTestingController.expectOne('api/session/1/participate/3');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle a bad request error on DELETE /api/session/:id/participate/:userId with wrong userId', () => {
      service.unParticipate('1', 'abc').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpTestingController.expectOne('api/session/1/participate/abc');
      expect(req.request.method).toBe('DELETE');
      req.flush('Invalid user ID', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle a session not found error on DELETE /api/session/:id/participate/:userId', () => {
      service.unParticipate('9999', '3').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/9999/participate/3');
      expect(req.request.method).toBe('DELETE');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle a user not found error on DELETE /api/session/:id/participate/:userId', () => {
      service.unParticipate('1', '9999').subscribe({
        next: () => {
          throw new Error('Expected an error, but got a response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpTestingController.expectOne('api/session/1/participate/9999');
      expect(req.request.method).toBe('DELETE');
      req.flush('Session not found', { status: 404, statusText: 'Not Found' });
    });
  });
});