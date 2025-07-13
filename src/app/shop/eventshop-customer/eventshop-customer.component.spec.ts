import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventshopCustomerComponent } from './eventshop-customer.component';

describe('EventshopCustomerComponent', () => {
  let component: EventshopCustomerComponent;
  let fixture: ComponentFixture<EventshopCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventshopCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventshopCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
