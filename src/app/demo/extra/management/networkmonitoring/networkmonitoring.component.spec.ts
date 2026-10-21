import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkmonitoringComponent } from './networkmonitoring.component';

describe('NetworkmonitoringComponent', () => {
  let component: NetworkmonitoringComponent;
  let fixture: ComponentFixture<NetworkmonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkmonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
