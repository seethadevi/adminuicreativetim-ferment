import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducersubComponent } from './producersub.component';

describe('ProducersubComponent', () => {
  let component: ProducersubComponent;
  let fixture: ComponentFixture<ProducersubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducersubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducersubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
