import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonactivelistComponent } from './nonactivelist.component';

describe('NonactivelistComponent', () => {
  let component: NonactivelistComponent;
  let fixture: ComponentFixture<NonactivelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonactivelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonactivelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
