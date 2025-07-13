import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VineyardListComponent } from './vineyard-list.component';

describe('VineyardListComponent', () => {
  let component: VineyardListComponent;
  let fixture: ComponentFixture<VineyardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VineyardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VineyardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
