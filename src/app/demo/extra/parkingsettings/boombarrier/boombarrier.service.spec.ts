import { TestBed } from '@angular/core/testing';

import { BoombarrierService } from './boombarrier.service';

describe('BoombarrierService', () => {
  let service: BoombarrierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoombarrierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
