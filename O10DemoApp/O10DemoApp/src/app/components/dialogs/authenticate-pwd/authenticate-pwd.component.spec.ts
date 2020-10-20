import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatePwdComponent } from './authenticate-pwd.component';

describe('AuthenticatePwdComponent', () => {
  let component: AuthenticatePwdComponent;
  let fixture: ComponentFixture<AuthenticatePwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticatePwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
