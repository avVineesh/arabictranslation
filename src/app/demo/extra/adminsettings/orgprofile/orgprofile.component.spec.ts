import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgprofileComponent } from './orgprofile.component';

describe('OrgprofileComponent', () => {
  let component: OrgprofileComponent;
  let fixture: ComponentFixture<OrgprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
