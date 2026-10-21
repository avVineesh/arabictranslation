import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkinghistoryComponent } from './parkinghistory.component';

describe('ParkinghistoryComponent', () => {
  let component: ParkinghistoryComponent;
  let fixture: ComponentFixture<ParkinghistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkinghistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkinghistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
