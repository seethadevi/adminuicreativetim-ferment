import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeezeventListComponent } from './weezevent-list.component';

describe('WeezeventListComponent', () => {
  let component: WeezeventListComponent;
  let fixture: ComponentFixture<WeezeventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeezeventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeezeventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
