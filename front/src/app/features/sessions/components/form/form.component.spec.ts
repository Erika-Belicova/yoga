import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
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

import { FormComponent } from './form.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';
import { mockTeachers } from 'src/app/mocks/teacher.mocks';
import { mockSession, mockUpdatedSession } from 'src/app/mocks/session.mocks';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let sessionApiService: Partial<SessionApiService>;
  let sessionService: Partial<SessionService>;
  let teacherService: Partial<TeacherService>;
  let router: Router;
  let snackBar: MatSnackBar;
  let activatedRoute: ActivatedRoute;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  } 

  beforeEach(async () => {
    sessionApiService = {
      detail: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    };
    teacherService = {
      all: jest.fn(() => of(mockTeachers))
    };
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
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
        { provide: TeacherService, useValue: teacherService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: jest.fn() } }
          }
        }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields in create mode', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');

    fixture.detectChanges();

    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.value).toEqual({
      name: '',
      description: '',
      date: '',
      teacher_id: ''
    });

    expect(teacherService.all).toHaveBeenCalled();
  });

  it('should initialize form properly with a session object', () => {
    (component as any).initForm(mockSession);

    expect(component.sessionForm?.value).toEqual({
      name: mockSession.name,
      description: mockSession.description,
      date: new Date(mockSession.date).toISOString().split('T')[0],
      teacher_id: mockSession.teacher_id
    });
  });

  it('should submit create form and navigate when session created', (done) => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: 'New Session',
      description: 'Create description',
      date: '2025-08-01',
      teacher_id: '1',
    });

    (sessionApiService.create as jest.Mock).mockReturnValue(of({}));

    const snackSpy = jest.spyOn(snackBar, 'open').mockImplementation(() => ({}) as any);
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.submit();

    setTimeout(() => {
      expect(sessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value);
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

    (sessionApiService.detail as jest.Mock).mockReturnValue(of(mockSession));

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect((component as any).id).toBe('5');
    expect(sessionApiService.detail).toHaveBeenCalledWith('5');
  });

  it('should set onUpdate, call detail and initialize form in update mode', (done) => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');
    jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('1');

    (sessionApiService.detail as jest.Mock) = jest.fn().mockReturnValue(of(mockSession));
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    component.ngOnInit();

    setTimeout(() => {
      expect(component.onUpdate).toBe(true);
      expect((component as any).id).toBe('1');
      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
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

    (sessionApiService.update as jest.Mock).mockReturnValue(of(mockUpdatedSession));

    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    (component as any).exitPage = jest.fn(() => {
      router.navigate(['sessions']);
    });

    component.submit();

    expect(sessionApiService.update).toHaveBeenCalledWith('1', component.sessionForm?.value);
    expect((component as any).exitPage).toHaveBeenCalledWith('Session updated !');
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should fetch teachers list on init', (done) => {
    component.teachers$.subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
      done();
    });
    expect(teacherService.all).toHaveBeenCalled();
  });

  it('should show snackbar and navigate on exitPage call', () => {
    const snackSpy = jest.spyOn(snackBar, 'open').mockReturnValue({} as any);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).exitPage('Test message');

    expect(snackSpy).toHaveBeenCalledWith('Test message', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});