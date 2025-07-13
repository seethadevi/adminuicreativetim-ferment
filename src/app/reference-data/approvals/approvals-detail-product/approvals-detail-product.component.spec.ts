import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsDetailProductComponent } from './approvals-detail-product.component';

describe('ApprovalsDetailProductComponent', () => {
  let component: ApprovalsDetailProductComponent;
  let fixture: ComponentFixture<ApprovalsDetailProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsDetailProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsDetailProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
