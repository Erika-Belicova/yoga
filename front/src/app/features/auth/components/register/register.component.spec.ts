import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { mockRegisterRequest } from 'src/app/mocks/auth.mocks';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpTestingController: HttpTestingController;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should register and redirect on successful register', () => {
    component.form.setValue({
      email: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      password: 'password'
    });

    component.submit();

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockRegisterRequest);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should invalidate an empty register form', () => {
    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });

    expect(component.form.invalid).toBe(true);
  });

  it('should require a valid email adress', () => {
    component.form.setValue({
      email: 'claireperret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      password: 'password'
    });

    const verifyEmail = component.form.get('email');

    expect(verifyEmail?.valid).toBe(false);
    expect(verifyEmail?.errors).toHaveProperty('email');
  });

  it('should set onError to true in case of a register error', () => {
    component.form.setValue({
      email: 'claire@perret.com',
      firstName: 'Claire',
      lastName: 'Perret',
      password: 'password'
    });

    component.submit();

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush('Registration failed', { status: 400, statusText: 'Bad Request' });

    expect(component.onError).toBe(true);
  });
});
