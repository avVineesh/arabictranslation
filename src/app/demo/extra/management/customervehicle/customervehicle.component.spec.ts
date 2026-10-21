import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomervehicleComponent } from './customervehicle.component';

describe('CustomervehicleComponent', () => {
  let component: CustomervehicleComponent;
  let fixture: ComponentFixture<CustomervehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomervehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomervehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
