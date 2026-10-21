import { TestBed } from '@angular/core/testing';

import { SettariffService } from './settariff.service';

describe('SettariffService', () => {
  let service: SettariffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettariffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
