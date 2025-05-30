import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';

import { mockTeachers } from 'src/app/mocks/teacher.mocks';
import { mockSession, mockUpdatedSession } from 'src/app/mocks/session.mocks';

describe('FormComponent (Integration)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let httpTestingController: HttpTestingController;
  let router: Router;
  let snackBar: MatSnackBar;
  let activatedRoute: ActivatedRoute;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        TeacherService,
        SessionApiService,
        { provide: SessionService, useValue: mockSessionService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn()
              }
            }
          }
        }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    const reqTeacher = httpTestingController.expectOne('api/teacher');
    reqTeacher.flush(mockTeachers);

    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not redirect if user is admin', () => {
    const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockSessionService.sessionInformation.admin = true;

    component.ngOnInit();

    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should initialize the form with empty fields in create mode', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');

    component.ngOnInit();

    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.value).toEqual({
      name: '',
      description: '',
      date: '',
      teacher_id: ''
    });
  });

  it('should submit create form and navigate when session created', (done) => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');

    component.ngOnInit();

    component.sessionForm?.setValue({
      name: 'New Session',
      description: 'Create description',
      date: '2025-08-01',
      teacher_id: '1',
    });

    const snackSpy = jest.spyOn(snackBar, 'open').mockImplementation(() => ({}) as any);
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.submit();

    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.sessionForm?.value);
    req.flush({});

    setTimeout(() => {
      expect(snackSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
      expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
      done();
    }, 0);
  });

  it('should set onUpdate to false and id to undefined for create route', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');

    component.ngOnInit();

    expect(component.onUpdate).toBe(false);
    expect((component as any).id).toBeUndefined();
  });

  it('should set onUpdate to true and id on update route', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/5');
    jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('5');

    component.ngOnInit();

    const req = httpTestingController.expectOne('api/session/5');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSession);

    expect(component.onUpdate).toBe(true);
    expect((component as any).id).toBe('5');
  });

  it('should set onUpdate, call detail and initialize form in update mode', (done) => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');
    jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('1');

    const initFormSpy = jest.spyOn(component as any, 'initForm');
    component.ngOnInit();

    const req = httpTestingController.expectOne('api/session/1');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSession);

    setTimeout(() => {
      expect(component.onUpdate).toBe(true);
      expect((component as any).id).toBe('1');
      expect(initFormSpy).toHaveBeenCalledWith(mockSession);

      expect(component.sessionForm?.value).toEqual({
        name: mockSession.name,
        description: mockSession.description,
        date: new Date(mockSession.date).toISOString().split('T')[0],
        teacher_id: mockSession.teacher_id
      });
      done();
    }, 0);
  });

  it('should call update with correct message on submit', () => {
    component.onUpdate = true;
    (component as any).id = '1';

    component.sessionForm?.setValue({
      name: 'Updated Session',
      description: 'Updated description',
      date: '2025-05-20',
      teacher_id: '1'
    });

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    (component as any).exitPage = jest.fn(() => {
      router.navigate(['sessions']);
    });

    component.submit();

    const req = httpTestingController.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(component.sessionForm?.value);
    req.flush(mockUpdatedSession);

    expect((component as any).exitPage).toHaveBeenCalledWith('Session updated !');
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});