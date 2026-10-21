import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtariffComponent } from './viewtariff.component';

describe('ViewtariffComponent', () => {
  let component: ViewtariffComponent;
  let fixture: ComponentFixture<ViewtariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewtariffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewtariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
