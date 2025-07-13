import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxclassComponent } from './taxclass.component';

describe('TaxclassComponent', () => {
  let component: TaxclassComponent;
  let fixture: ComponentFixture<TaxclassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxclassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
