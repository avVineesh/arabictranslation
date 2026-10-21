import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfreadersComponent } from './rfreaders.component';

describe('RfreadersComponent', () => {
  let component: RfreadersComponent;
  let fixture: ComponentFixture<RfreadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfreadersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfreadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
