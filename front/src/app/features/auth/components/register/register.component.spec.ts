import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { mockRegisterRequest } from 'src/app/mocks/auth.mocks';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockReturnValue(of(mockRegisterRequest))
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [ { provide: AuthService, useValue: mockAuthService },
                  { provide: Router, useValue: mockRouter } ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register and redirect on successful register', () => {
    component.form.setValue({ email: 'claire@perret.com',
                              firstName: 'Claire',
                              lastName: 'Perret',
                              password: 'password'});
                              
    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({ email: 'claire@perret.com',
                                                            firstName: 'Claire',
                                                            lastName: 'Perret',
                                                            password: 'password' });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should invalidate an empty register form', () => {
    component.form.setValue({ email: '', firstName: '', lastName: '', password: '' });
    component.submit();

    expect(component.form.invalid).toBe(true);
  });

  it('should require a valid email adress', () => {
    component.form.setValue({ email: 'claireperret.com', firstName: 'Claire', lastName: 'Perret', password: 'password' });
    const verifyEmail = component.form.get('email');

    expect(verifyEmail?.valid).toBe(false);
    expect(verifyEmail?.errors).toHaveProperty('email');
  });

  it('should set onError to true in case of a register error', () => {
    mockAuthService.register = jest.fn().mockReturnValue(throwError(() => new Error('Register failed')));
    component.submit();

    expect(component.onError).toBe(true);
  })
});