import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxclassFormComponent } from './taxclass-form.component';

describe('TaxclassFormComponent', () => {
  let component: TaxclassFormComponent;
  let fixture: ComponentFixture<TaxclassFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxclassFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxclassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
