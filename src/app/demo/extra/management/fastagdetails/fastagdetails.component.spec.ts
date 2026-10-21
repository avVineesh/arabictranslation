import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastagdetailsComponent } from './fastagdetails.component';

describe('FastagdetailsComponent', () => {
  let component: FastagdetailsComponent;
  let fixture: ComponentFixture<FastagdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastagdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastagdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
