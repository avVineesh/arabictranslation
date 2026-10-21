import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleparkedreportComponent } from './vehicleparkedreport.component';

describe('VehicleparkedreportComponent', () => {
  let component: VehicleparkedreportComponent;
  let fixture: ComponentFixture<VehicleparkedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleparkedreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleparkedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
