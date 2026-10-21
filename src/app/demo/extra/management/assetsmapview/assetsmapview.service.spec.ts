import { TestBed } from '@angular/core/testing';

import { AssetsmapviewService } from './assetsmapview.service';

describe('AssetsmapviewService', () => {
  let service: AssetsmapviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsmapviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
