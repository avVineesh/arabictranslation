import { TestBed } from '@angular/core/testing';

import { RftagdetailsService } from './rftagdetails.service';

describe('RftagdetailsService', () => {
  let service: RftagdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RftagdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
