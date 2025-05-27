import { HttpClientModule } from '@angular/common/http';
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
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { mockLoginRequest } from 'src/app/mocks/auth.mocks';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: Partial<AuthService>;
  let mockSessionService: Partial<SessionService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockReturnValue(of(mockLoginRequest))
    };

    mockSessionService = {
      logIn: jest.fn(),
    }

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [ { provide: SessionService, useValue: mockSessionService },
                  { provide: AuthService, useValue: mockAuthService },
                  { provide: Router, useValue: mockRouter } ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in and redirect on successful login', () => {
    const logInSpy = jest.spyOn(mockSessionService, 'logIn');
    component.form.setValue({ email: 'claire@perret.com', password: 'password' });
    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'claire@perret.com', password: 'password' });
    expect(logInSpy).toHaveBeenCalledWith(mockLoginRequest);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should invalidate an empty login form', () => {
    component.form.setValue({ email: '', password: '' });
    component.submit();

    expect(component.form.invalid).toBe(true);
  });

  it('should require a valid email adress', () => {
    component.form.setValue({ email: 'claireperret.com', password: 'password' });
    const verifyEmail = component.form.get('email');

    expect(verifyEmail?.valid).toBe(false);
    expect(verifyEmail?.errors).toHaveProperty('email');
  });

  it('should set onError to true in case of a login error', () => {
    mockAuthService.login = jest.fn().mockReturnValue(throwError(() => new Error('Login failed')));
    component.submit();

    expect(component.onError).toBe(true);
  })
});