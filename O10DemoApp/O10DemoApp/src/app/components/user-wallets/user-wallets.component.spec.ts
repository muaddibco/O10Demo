import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWalletsComponent } from './user-wallets.component';

describe('UserWalletsComponent', () => {
  let component: UserWalletsComponent;
  let fixture: ComponentFixture<UserWalletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWalletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
