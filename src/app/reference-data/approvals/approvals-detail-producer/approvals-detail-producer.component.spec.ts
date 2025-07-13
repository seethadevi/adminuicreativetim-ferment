import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsDetailProducerComponent } from './approvals-detail-producer.component';

describe('ApprovalsDetailProducerComponent', () => {
  let component: ApprovalsDetailProducerComponent;
  let fixture: ComponentFixture<ApprovalsDetailProducerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsDetailProducerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsDetailProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
