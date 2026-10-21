import { TestBed } from '@angular/core/testing';

import { GatesService } from './gates.service';

describe('GatesService', () => {
  let service: GatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
