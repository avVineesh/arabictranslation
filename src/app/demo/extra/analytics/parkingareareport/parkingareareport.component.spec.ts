import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingareareportComponent } from './parkingareareport.component';

describe('ParkingareareportComponent', () => {
  let component: ParkingareareportComponent;
  let fixture: ComponentFixture<ParkingareareportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingareareportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingareareportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
