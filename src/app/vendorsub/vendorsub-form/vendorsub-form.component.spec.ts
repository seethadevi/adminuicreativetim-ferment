import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsubFormComponent } from './vendorsub-form.component';

describe('VendorFormComponent', () => {
  let component: VendorsubFormComponent;
  let fixture: ComponentFixture<VendorsubFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsubFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsubFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
