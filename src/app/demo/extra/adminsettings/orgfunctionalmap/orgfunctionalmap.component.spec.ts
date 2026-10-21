import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgfunctionalmapComponent } from './orgfunctionalmap.component';

describe('OrgfunctionalmapComponent', () => {
  let component: OrgfunctionalmapComponent;
  let fixture: ComponentFixture<OrgfunctionalmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgfunctionalmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgfunctionalmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
