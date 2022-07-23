import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherCourseComponent } from './add-other-course.component';

describe('AddOtherCourseComponent', () => {
  let component: AddOtherCourseComponent;
  let fixture: ComponentFixture<AddOtherCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOtherCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOtherCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
