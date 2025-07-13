import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelRequestComponent } from './channel-request.component';

describe('ChannelRequestComponent', () => {
  let component: ChannelRequestComponent;
  let fixture: ComponentFixture<ChannelRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
