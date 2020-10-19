import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityProvidersComponent } from './identity-providers.component';

describe('IdentityProvidersComponent', () => {
  let component: IdentityProvidersComponent;
  let fixture: ComponentFixture<IdentityProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
