import { TestBed } from '@angular/core/testing';

import { OrgdomainService } from './orgdomain.service';

describe('OrgdomainService', () => {
  let service: OrgdomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgdomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
