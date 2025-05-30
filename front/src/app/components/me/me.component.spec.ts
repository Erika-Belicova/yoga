import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { mockUser } from '../../mocks/user.mocks';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let httpTestingController: HttpTestingController;

  let mockRouter: Partial<Router>;
  let mockSnackBar: Partial<MatSnackBar>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockSnackBar = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        UserService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpTestingController.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user on init', () => {
    component.ngOnInit();

    const req = httpTestingController.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    expect(component.user).toEqual(mockUser);
  });

  it('should delete account and perform necessary actions', () => {
    component.delete();

    const req = httpTestingController.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    expect(mockSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should verify that back has been called', () => {
    const windowSpy = jest.spyOn(window.history, 'back');
    component.back();

    expect(windowSpy).toHaveBeenCalled();
    windowSpy.mockRestore();
  });
});