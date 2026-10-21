import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsmapviewComponent } from './assetsmapview.component';

describe('AssetsmapviewComponent', () => {
  let component: AssetsmapviewComponent;
  let fixture: ComponentFixture<AssetsmapviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsmapviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsmapviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
