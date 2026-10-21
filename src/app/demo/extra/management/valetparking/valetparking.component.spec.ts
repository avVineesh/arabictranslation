import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValetparkingComponent } from './valetparking.component';

describe('ValetparkingComponent', () => {
  let component: ValetparkingComponent;
  let fixture: ComponentFixture<ValetparkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValetparkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValetparkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
