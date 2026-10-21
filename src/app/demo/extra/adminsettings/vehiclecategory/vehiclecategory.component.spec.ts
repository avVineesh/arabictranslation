import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclecategoryComponent } from './vehiclecategory.component';

describe('VehiclecategoryComponent', () => {
  let component: VehiclecategoryComponent;
  let fixture: ComponentFixture<VehiclecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
