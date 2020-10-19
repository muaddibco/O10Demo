import { TestBed } from '@angular/core/testing';

import { SchemeResolutionService } from './scheme-resolution.service';

describe('SchemeDefinitionService', () => {
  let service: SchemeResolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeResolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
