import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RftagdetailsComponent } from './rftagdetails.component';

describe('RftagdetailsComponent', () => {
  let component: RftagdetailsComponent;
  let fixture: ComponentFixture<RftagdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RftagdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RftagdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
