import { TestBed } from '@angular/core/testing';

import { PosdeviceService } from './posdevice.service';

describe('PosdeviceService', () => {
  let service: PosdeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosdeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
