import { TestBed } from '@angular/core/testing';

import { VehicleblacklistingService } from './vehicleblacklisting.service';

describe('VehicleblacklistingService', () => {
  let service: VehicleblacklistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleblacklistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
