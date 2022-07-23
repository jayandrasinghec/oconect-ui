import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseWindowComponent } from './course-window.component';

describe('CourseWindowComponent', () => {
  let component: CourseWindowComponent;
  let fixture: ComponentFixture<CourseWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
