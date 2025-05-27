import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals'; 

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';

import { mockTeacher } from '../../../../mocks/teacher.mocks';
import { mockSession } from '../../../../mocks/session.mocks';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let sessionApiService: SessionApiService;

  let httpTestingController: HttpTestingController;
  let snackBar: MatSnackBar;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
        TeacherService
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;

      sessionApiService = TestBed.inject(SessionApiService);
      snackBar = TestBed.inject(MatSnackBar);
      router = TestBed.inject(Router);
      httpTestingController = TestBed.inject(HttpTestingController);

      component.sessionId = '1';
      fixture.detectChanges();

      const sessionReq = httpTestingController.expectOne('api/session/1');
      sessionReq.flush(mockSession);

      const teacherReq = httpTestingController.expectOne(`api/teacher/${mockSession.teacher_id}`);
      teacherReq.flush(mockTeacher);
    });
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdmin to true when user is admin', () => {
    expect(component.isAdmin).toBe(true);
  });

  it('should set isParticipate to true if current user is in session users list', () => {
    expect(component.isParticipate).toBe(true);
  });

  it('should set isParticipate to false if current user is not in session users list', () => {
    const sessionWithoutUser = { ...mockSession, users: [2, 3] };

    component.sessionId = '1';
    component.ngOnInit();

    const sessionReq = httpTestingController.expectOne('api/session/1');
    sessionReq.flush(sessionWithoutUser);

    const teacherReq = httpTestingController.expectOne('api/teacher/1');
    teacherReq.flush(mockTeacher);

    expect(component.isParticipate).toBe(false);
  });

  it('should verify that back has been called', () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();

    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });

  it('should not modify session state when back is called', () => {
    const previousSession = component.session;
    component.back();
    expect(component.session).toBe(previousSession);
  });

  it('should delete the session and verify that snackbar is open', async () => {
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    const snackBarSpy = jest.spyOn(snackBar, 'open');

    component.delete();

    const deleteReq = httpTestingController.expectOne('api/session/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    expect(snackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });

    await fixture.whenStable();
  });

  it('should navigate to sessions after deletion', () => {
    const navSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.delete();

    const req = httpTestingController.expectOne('api/session/1');
    req.flush(null);

    expect(navSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should load teacher details after session is fetched', () => {
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should call participate and then fetchSession', async () => {
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.sessionId = '1';
    component.userId = '3';

    component.participate();

    const participateReq = httpTestingController.expectOne('api/session/1/participate/3');
    expect(participateReq.request.method).toBe('POST');
    participateReq.flush(null);

    const fetchSessionReq = httpTestingController.expectOne('api/session/1');
    expect(fetchSessionReq.request.method).toBe('GET');
    fetchSessionReq.flush(mockSession);

    const teacherReq = httpTestingController.expectOne('api/teacher/1');
    expect(teacherReq.request.method).toBe('GET');
    teacherReq.flush(mockTeacher);

    await fixture.whenStable();
  });

  it('should call unParticipate and then fetchSession', async () => {
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.sessionId = '1';
    component.userId = '3';

    component.unParticipate();

    const unParticipateReq = httpTestingController.expectOne('api/session/1/participate/3');
    expect(unParticipateReq.request.method).toBe('DELETE');
    unParticipateReq.flush(null);

    const fetchSessionReq = httpTestingController.expectOne('api/session/1');
    expect(fetchSessionReq.request.method).toBe('GET');
    fetchSessionReq.flush(mockSession);

    const teacherReq = httpTestingController.expectOne('api/teacher/1');
    expect(teacherReq.request.method).toBe('GET');
    teacherReq.flush(mockTeacher);

    await fixture.whenStable();
  });

  it('should load session and teacher on ngOnInit', () => {
    component.ngOnInit();

    const sessionReq = httpTestingController.expectOne('api/session/1');
    sessionReq.flush(mockSession);

    const teacherReq = httpTestingController.expectOne(`api/teacher/${mockSession.teacher_id}`);
    teacherReq.flush(mockTeacher);

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should update session and teacher when ngOnInit is called', () => {
    component.ngOnInit();

    const sessionReq = httpTestingController.expectOne('api/session/1');
    sessionReq.flush(mockSession);

    const teacherReq = httpTestingController.expectOne(`api/teacher/${mockSession.teacher_id}`);
    teacherReq.flush(mockTeacher);

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });
});