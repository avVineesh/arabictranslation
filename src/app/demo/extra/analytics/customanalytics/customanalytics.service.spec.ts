import { TestBed } from '@angular/core/testing';

import { CustomanalyticsService } from './customanalytics.service';

describe('CustomanalyticsService', () => {
  let service: CustomanalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomanalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
