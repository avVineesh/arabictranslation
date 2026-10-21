import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoombarrierComponent } from './boombarrier.component';

describe('BoombarrierComponent', () => {
  let component: BoombarrierComponent;
  let fixture: ComponentFixture<BoombarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoombarrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoombarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
