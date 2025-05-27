import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let sessionService: jest.Mocked<SessionService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const sessionServiceMock = {
      $isLogged: jest.fn(),
      logOut: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should return true from $isLogged when service says logged in', (done) => {
    sessionService.$isLogged.mockReturnValue(of(true));
    
    app.$isLogged().subscribe((result) => {
      expect(result).toBe(true);
      expect(sessionService.$isLogged).toHaveBeenCalled();
      done();
    });
  });

  it('should call logOut on sessionService and navigate to root on logout', () => {
    app.logout();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  }); 
});
