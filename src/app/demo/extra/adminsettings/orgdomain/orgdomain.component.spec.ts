import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgdomainComponent } from './orgdomain.component';

describe('OrgdomainComponent', () => {
  let component: OrgdomainComponent;
  let fixture: ComponentFixture<OrgdomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgdomainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgdomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
