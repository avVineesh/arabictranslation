import { TestBed } from '@angular/core/testing';

import { ParkinghistoryService } from './parkinghistory.service';

describe('ParkinghistoryService', () => {
  let service: ParkinghistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkinghistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
