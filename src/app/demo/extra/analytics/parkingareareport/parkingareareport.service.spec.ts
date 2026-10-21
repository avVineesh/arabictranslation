import { TestBed } from '@angular/core/testing';

import { ParkingareareportService } from './parkingareareport.service';

describe('ParkingareareportService', () => {
  let service: ParkingareareportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingareareportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
