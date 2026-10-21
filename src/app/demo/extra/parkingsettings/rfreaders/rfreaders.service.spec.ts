import { TestBed } from '@angular/core/testing';

import { RfreadersService } from './rfreaders.service';

describe('RfreadersService', () => {
  let service: RfreadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfreadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
