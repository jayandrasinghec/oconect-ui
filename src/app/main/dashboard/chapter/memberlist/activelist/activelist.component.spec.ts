import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivelistComponent } from './activelist.component';

describe('ActivelistComponent', () => {
  let component: ActivelistComponent;
  let fixture: ComponentFixture<ActivelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
