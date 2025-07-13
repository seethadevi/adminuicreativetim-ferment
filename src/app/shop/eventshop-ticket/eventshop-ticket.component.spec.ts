import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventshopTicketComponent } from './eventshop-ticket.component';

describe('EventshopTicketComponent', () => {
  let component: EventshopTicketComponent;
  let fixture: ComponentFixture<EventshopTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventshopTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventshopTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
