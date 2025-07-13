import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralwarehouseproductListComponent } from './centralwarehouseproduct-list.component';

describe('CentralwarehouseproductListComponent', () => {
  let component: CentralwarehouseproductListComponent;
  let fixture: ComponentFixture<CentralwarehouseproductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralwarehouseproductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralwarehouseproductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
