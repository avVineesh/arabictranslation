import { TestBed } from '@angular/core/testing';

import { ValetparkingService } from './valetparking.service';

describe('ValetparkingService', () => {
  let service: ValetparkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValetparkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
