import { TestBed } from '@angular/core/testing';

import { PaymentlogService } from './paymentlog.service';

describe('PaymentlogService', () => {
  let service: PaymentlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
