import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormListComponent } from './dynamic-form-list.component';

describe('DynamicFormListComponent', () => {
  let component: DynamicFormListComponent;
  let fixture: ComponentFixture<DynamicFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
