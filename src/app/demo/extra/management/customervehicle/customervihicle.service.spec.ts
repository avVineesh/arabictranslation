import { TestBed } from '@angular/core/testing';

import { CustomervihicleService } from './customervihicle.service';

describe('CustomervihicleService', () => {
  let service: CustomervihicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomervihicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
