import { TestBed } from '@angular/core/testing';

import { DemoStateService } from './demo-state.service';

describe('DemoStateService', () => {
  let service: DemoStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
