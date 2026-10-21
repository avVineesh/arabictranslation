import { TestBed } from '@angular/core/testing';

import { VehicleparkedreportService } from './vehicleparkedreport.service';

describe('VehicleparkedreportService', () => {
  let service: VehicleparkedreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleparkedreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
