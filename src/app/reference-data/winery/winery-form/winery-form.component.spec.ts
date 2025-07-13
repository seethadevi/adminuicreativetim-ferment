import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WineryFormComponent } from './winery-form.component';

describe('WineryFormComponent', () => {
  let component: WineryFormComponent;
  let fixture: ComponentFixture<WineryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WineryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WineryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
