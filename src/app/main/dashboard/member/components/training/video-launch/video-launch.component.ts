import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { VideoService } from 'app/services/video.service';

@Component({
  selector: 'app-video-launch',
  templateUrl: './video-launch.component.html',
  styleUrls: ['./video-launch.component.scss']
})
export class VideoLaunchComponent implements OnInit {
  comment:any='';
  title = "";
  description = "";
  videoUrl = "";
  recentVideos:any[]=[];
  showSpinner:boolean = false;
  arrComments:any[]=[];
  constructor(private location: Location, private videoService: VideoService) { }

  async ngOnInit() {
    const dataFromRoute: any = this.location.getState();
    console.log('dataFromRoute', dataFromRoute)
    if(dataFromRoute.entity.title) {
      this.title = dataFromRoute.entity.title;
      this.description = dataFromRoute.entity.description;
      this.videoUrl = dataFromRoute.entity.videoUrl.url;
    }


    this.recentVideos = [];
    this.recentVideos = await this.videoService.getRecentVideos();

  }

  handleVideoClick(recentVideo) {
    console.log('recentVideo', recentVideo)
    this.videoUrl = recentVideo.entity.videoUrl.url;
    this.title = recentVideo.entity.title;
    this.description = recentVideo.entity.description;

  }
  addComent(event){
    if(this.comment !=''){
      this.arrComments.push(this.comment);
      this.comment ='';
    }
  }
  cancel(event){

  }

}
