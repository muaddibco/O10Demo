import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpFrontendComponent } from './sp-frontend.component';

describe('SpFrontendComponent', () => {
  let component: SpFrontendComponent;
  let fixture: ComponentFixture<SpFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpFrontendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
