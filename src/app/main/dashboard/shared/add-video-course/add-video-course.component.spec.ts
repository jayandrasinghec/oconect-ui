import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoCourseComponent } from './add-video-course.component';

describe('AddVideoCourseComponent', () => {
  let component: AddVideoCourseComponent;
  let fixture: ComponentFixture<AddVideoCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideoCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideoCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
