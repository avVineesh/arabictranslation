import { TestBed } from '@angular/core/testing';

import { ViewtariffService } from './viewtariff.service';

describe('ViewtariffService', () => {
  let service: ViewtariffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewtariffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
