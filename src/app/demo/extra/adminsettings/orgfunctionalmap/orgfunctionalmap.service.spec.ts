import { TestBed } from '@angular/core/testing';

import { OrgfunctionalmapService } from './orgfunctionalmap.service';

describe('OrgfunctionalmapService', () => {
  let service: OrgfunctionalmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgfunctionalmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
