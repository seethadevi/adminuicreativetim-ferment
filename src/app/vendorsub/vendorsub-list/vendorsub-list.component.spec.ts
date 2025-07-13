import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsubListComponent } from './vendorsub-list.component';

describe('VendorsubListComponent', () => {
  let component: VendorsubListComponent;
  let fixture: ComponentFixture<VendorsubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
