import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralwarehouseFormComponent } from './centralwarehouse-form.component';

describe('CentralwarehouseFormComponent', () => {
  let component: CentralwarehouseFormComponent;
  let fixture: ComponentFixture<CentralwarehouseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralwarehouseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralwarehouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
