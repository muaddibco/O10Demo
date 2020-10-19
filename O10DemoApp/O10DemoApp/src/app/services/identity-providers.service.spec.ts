import { TestBed } from '@angular/core/testing';

import { IdentityProvidersService } from './identity-providers.service';

describe('IdentityProvidersService', () => {
  let service: IdentityProvidersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityProvidersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
