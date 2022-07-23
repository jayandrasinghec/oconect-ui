import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCoursesComponent } from './video-courses.component';

describe('VideoCoursesComponent', () => {
  let component: VideoCoursesComponent;
  let fixture: ComponentFixture<VideoCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
