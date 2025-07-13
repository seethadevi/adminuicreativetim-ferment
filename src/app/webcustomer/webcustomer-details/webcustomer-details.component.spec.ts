import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcustomerDetailsComponent } from './webcustomer-details.component';

describe('WebcustomerDetailsComponent', () => {
  let component: WebcustomerDetailsComponent;
  let fixture: ComponentFixture<WebcustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
