import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraplotComponent } from './cameraplot.component';

describe('CameraplotComponent', () => {
  let component: CameraplotComponent;
  let fixture: ComponentFixture<CameraplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraplotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
