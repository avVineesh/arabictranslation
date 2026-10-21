import { TestBed } from '@angular/core/testing';

import { AttendanceregisterService } from './attendanceregister.service';

describe('AttendanceregisterService', () => {
  let service: AttendanceregisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceregisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
