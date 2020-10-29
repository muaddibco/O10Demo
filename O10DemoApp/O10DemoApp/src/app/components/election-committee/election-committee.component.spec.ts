import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionCommitteeComponent } from './election-committee.component';

describe('ElectionCommitteeComponent', () => {
  let component: ElectionCommitteeComponent;
  let fixture: ComponentFixture<ElectionCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectionCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
