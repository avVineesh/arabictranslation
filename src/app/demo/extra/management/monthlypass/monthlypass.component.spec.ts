import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlypassComponent } from './monthlypass.component';

describe('MonthlypassComponent', () => {
  let component: MonthlypassComponent;
  let fixture: ComponentFixture<MonthlypassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlypassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlypassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
