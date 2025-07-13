import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCustomerComponent } from './channel-customer.component';

describe('ChannelCustomerComponent', () => {
  let component: ChannelCustomerComponent;
  let fixture: ComponentFixture<ChannelCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
