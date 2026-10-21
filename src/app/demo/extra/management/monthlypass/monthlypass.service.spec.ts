import { TestBed } from '@angular/core/testing';

import { MonthlypassService } from './monthlypass.service';

describe('MonthlypassService', () => {
  let service: MonthlypassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlypassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
