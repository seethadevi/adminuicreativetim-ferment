import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcustomerComponent } from './webcustomer.component';

describe('WebcustomerComponent', () => {
  let component: WebcustomerComponent;
  let fixture: ComponentFixture<WebcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
