import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceregisterComponent } from './attendanceregister.component';

describe('AttendanceregisterComponent', () => {
  let component: AttendanceregisterComponent;
  let fixture: ComponentFixture<AttendanceregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
