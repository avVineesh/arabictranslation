import { TestBed } from '@angular/core/testing';

import { VehiclecategoryService } from './vehiclecategory.service';

describe('VehiclecategoryService', () => {
  let service: VehiclecategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclecategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
