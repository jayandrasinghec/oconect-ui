import { Component, OnInit,Input ,ViewEncapsulation} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { VideoService } from 'app/services/video.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {AddVideoCourseComponent} from '../../../../shared/add-video-course/add-video-course.component';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})
export class VideoComponent implements OnInit {
   @Input() isCoOrdinator:boolean;
   @Input() chapter:any;
   filteredCourses: any[]=[];
   searchTerm:any;
  constructor(private toastr: ToastrService,
              public dialog: MatDialog,
              private router : Router,
              private videoService: VideoService) {

               }

  async ngOnInit() {
    this.getVideos();
  }
  async getVideos(){
     this.filteredCourses = [];
     this.filteredCourses = await this.videoService.getVideos();
  }
  handleVideoClick(course) {
    this.router.navigateByUrl(this.router.url+'/video', { state: { ...course } });
  }

  filterCoursesByTerm(): void
  {
      
  }
 addCourse(event){

     const dialogRef = this.dialog.open(AddVideoCourseComponent, {
      width: '60%',
      data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }],video_type:'knowledgecenter' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
        this.toastr.success('Video uploaded successfully.');
         this.getVideos();
                   
       }      
    });
  }
}
