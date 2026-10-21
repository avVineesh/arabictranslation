import { TestBed } from '@angular/core/testing';

import { FastagdetailsService } from './fastagdetails.service';

describe('FastagdetailsService', () => {
  let service: FastagdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FastagdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
