import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducersubFormComponent } from './producersub-form.component';

describe('ProducersubFormComponent', () => {
  let component: ProducersubFormComponent;
  let fixture: ComponentFixture<ProducersubFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducersubFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducersubFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
