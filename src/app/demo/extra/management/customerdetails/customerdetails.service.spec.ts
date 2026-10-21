import { TestBed } from '@angular/core/testing';

import { CustomerdetailsService } from './customerdetails.service';

describe('CustomerdetailsService', () => {
  let service: CustomerdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
