import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducersubListComponent } from './producersub-list.component';

describe('ProducersubListComponent', () => {
  let component: ProducersubListComponent;
  let fixture: ComponentFixture<ProducersubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducersubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducersubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
