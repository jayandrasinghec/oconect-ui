import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLaunchComponent } from './video-launch.component';

describe('VideoLaunchComponent', () => {
  let component: VideoLaunchComponent;
  let fixture: ComponentFixture<VideoLaunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoLaunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
