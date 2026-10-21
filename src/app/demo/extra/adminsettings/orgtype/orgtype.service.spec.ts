import { TestBed } from '@angular/core/testing';

import { OrgtypeService } from './orgtype.service';

describe('OrgtypeService', () => {
  let service: OrgtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
