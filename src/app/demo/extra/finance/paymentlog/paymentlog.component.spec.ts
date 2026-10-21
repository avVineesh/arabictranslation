import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentlogComponent } from './paymentlog.component';

describe('PaymentlogComponent', () => {
  let component: PaymentlogComponent;
  let fixture: ComponentFixture<PaymentlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
