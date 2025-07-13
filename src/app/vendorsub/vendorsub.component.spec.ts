import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsubComponent } from './vendorsub.component';

describe('VendorComponent', () => {
  let component: VendorsubComponent;
  let fixture: ComponentFixture<VendorsubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
