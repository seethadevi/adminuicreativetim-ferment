import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplogoutComponent } from './applogout.component';

describe('ApplogoutComponent', () => {
  let component: ApplogoutComponent;
  let fixture: ComponentFixture<ApplogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
