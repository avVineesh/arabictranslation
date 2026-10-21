import { TestBed } from '@angular/core/testing';

import { OrgprofileService } from './orgprofile.service';

describe('OrgprofileService', () => {
  let service: OrgprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
