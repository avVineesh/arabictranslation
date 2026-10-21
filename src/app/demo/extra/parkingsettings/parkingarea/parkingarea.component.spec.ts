import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingareaComponent } from './parkingarea.component';

describe('ParkingareaComponent', () => {
  let component: ParkingareaComponent;
  let fixture: ComponentFixture<ParkingareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
