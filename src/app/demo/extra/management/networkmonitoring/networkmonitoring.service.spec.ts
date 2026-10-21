import { TestBed } from '@angular/core/testing';

import { NetworkmonitoringService } from './networkmonitoring.service';

describe('NetworkmonitoringService', () => {
  let service: NetworkmonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkmonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
