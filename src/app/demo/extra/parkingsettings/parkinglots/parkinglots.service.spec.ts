import { TestBed } from '@angular/core/testing';

import { ParkinglotsService } from './parkinglots.service';

describe('ParkinglotsService', () => {
  let service: ParkinglotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkinglotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
