import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettariffComponent } from './settariff.component';

describe('SettariffComponent', () => {
  let component: SettariffComponent;
  let fixture: ComponentFixture<SettariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettariffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
