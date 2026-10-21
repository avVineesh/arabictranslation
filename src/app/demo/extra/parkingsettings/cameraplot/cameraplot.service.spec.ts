import { TestBed } from '@angular/core/testing';

import { CameraplotService } from './cameraplot.service';

describe('CameraplotService', () => {
  let service: CameraplotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraplotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
