import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVoteComponent } from './user-vote.component';

describe('UserVoteComponent', () => {
  let component: UserVoteComponent;
  let fixture: ComponentFixture<UserVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
