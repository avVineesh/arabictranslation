import { TestBed } from '@angular/core/testing';

import { ParkingareaService } from './parkingarea.service';

describe('ParkingareaService', () => {
  let service: ParkingareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
