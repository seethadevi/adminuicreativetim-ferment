import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxclassListComponent } from './taxclass-list.component';

describe('TaxclassListComponent', () => {
  let component: TaxclassListComponent;
  let fixture: ComponentFixture<TaxclassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxclassListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxclassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
