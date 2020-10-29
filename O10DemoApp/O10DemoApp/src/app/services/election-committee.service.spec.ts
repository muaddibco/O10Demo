import { TestBed } from '@angular/core/testing';

import { ElectionCommitteeService } from './election-committee.service';

describe('ElectionCommitteeService', () => {
  let service: ElectionCommitteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionCommitteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
