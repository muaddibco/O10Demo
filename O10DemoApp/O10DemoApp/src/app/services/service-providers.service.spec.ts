import { TestBed } from '@angular/core/testing';

import { ServiceProvidersService } from './service-providers.service';

describe('ServiceProvidersService', () => {
  let service: ServiceProvidersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProvidersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
