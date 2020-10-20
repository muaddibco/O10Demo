import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIdentityComponent } from './request-identity.component';

describe('RequestIdentityComponent', () => {
  let component: RequestIdentityComponent;
  let fixture: ComponentFixture<RequestIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestIdentityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
