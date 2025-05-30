import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { mockLoginRequest } from 'src/app/mocks/auth.mocks';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

  let mockSessionService: Partial<SessionService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockSessionService = {
      logIn: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in and redirect on successful login', (done) => {
    component.form.setValue({ email: 'claire@perret.com', password: 'password' });
    component.submit();

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginRequest);

    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockLoginRequest);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    done();
  });

  it('should invalidate an empty login form', () => {
    component.form.setValue({ email: '', password: '' });

    expect(component.form.invalid).toBe(true);
  });

  it('should require a valid email adress', () => {
    component.form.setValue({ email: 'claireperret.com', password: 'password' });
    const verifyEmail = component.form.get('email');

    expect(verifyEmail?.valid).toBe(false);
    expect(verifyEmail?.errors).toHaveProperty('email');
  });

  it('should set onError to true in case of a login error', () => {
    component.form.setValue({ email: 'claire@perret.com', password: 'password' });
    component.submit();

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });

    expect(component.onError).toBe(true);
  });
});
