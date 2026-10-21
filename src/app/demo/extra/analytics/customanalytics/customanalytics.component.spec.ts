import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomanalyticsComponent } from './customanalytics.component';

describe('CustomanalyticsComponent', () => {
  let component: CustomanalyticsComponent;
  let fixture: ComponentFixture<CustomanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomanalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
