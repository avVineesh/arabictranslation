import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosdeviceComponent } from './posdevice.component';

describe('PosdeviceComponent', () => {
  let component: PosdeviceComponent;
  let fixture: ComponentFixture<PosdeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosdeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosdeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
