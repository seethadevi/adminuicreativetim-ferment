import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCreatorComponent } from './dynamic-form-creator.component';

describe('DynamicFormCreatorComponent', () => {
  let component: DynamicFormCreatorComponent;
  let fixture: ComponentFixture<DynamicFormCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
