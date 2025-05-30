import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from './services/session.service';
import { mockSessionInformation } from './mocks/session.information.mocks';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let sessionService: SessionService;
  let router: Router;
  let location: Location;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        SessionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should return true from $isLogged when service says logged in', (done) => {
    sessionService.logIn(mockSessionInformation);

    app.$isLogged().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should call logOut on sessionService and navigate to root on logout', async () => {
    app.logout();

    await fixture.whenStable();
    expect(location.path()).toBe('');
  });
});