import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleblacklistingComponent } from './vehicleblacklisting.component';

describe('VehicleblacklistingComponent', () => {
  let component: VehicleblacklistingComponent;
  let fixture: ComponentFixture<VehicleblacklistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleblacklistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleblacklistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
