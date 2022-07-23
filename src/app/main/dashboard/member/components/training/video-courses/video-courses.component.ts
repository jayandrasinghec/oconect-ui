import { Component, OnInit,Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {AddVideoCourseComponent} from '../../../../shared/add-video-course/add-video-course.component';
import { VideoService } from 'app/services/video.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-video-courses',
  templateUrl: './video-courses.component.html',
  styleUrls: ['./video-courses.component.scss'],
   animations : fuseAnimations
})
export class VideoCoursesComponent implements OnInit {
     @Input() isCoOrdinator:boolean;
     @Input() chapter:any;


    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[]=[];
    currentCategory: string;
    searchTerm: string;    
    private _unsubscribeAll: Subject<any>;
  constructor(private toastr: ToastrService, public dialog: MatDialog,
    private videoService: VideoService,
    private router: Router,
    private activatedRoute : ActivatedRoute) { 
        this.currentCategory = 'all';
        this.searchTerm = '';
        this._unsubscribeAll = new Subject();
  }


  handleVideoClick(course) {
    this.router.navigateByUrl(this.router.url+'/video', { state: { ...course } });
  }

  async ngOnInit() {
    this.getVideos();
    this.categories = [
        {
            'id'   : 0,
            'value': 'web',
            'label': 'Web'
        },
        {
            'id'   : 1,
            'value': 'firebase',
            'label': 'Firebase'
        },
        {
            'id'   : 2,
            'value': 'cloud',
            'label': 'Cloud'
        },
        {
            'id'   : 3,
            'value': 'android',
            'label': 'Android'
        }
    ];
  }
  async getVideos(){
      this.filteredCourses = this.courses = [];
     let chapterId = this.activatedRoute.snapshot.paramMap.get('chapterID')
     this.filteredCourses = this.courses = await this.videoService.getChapterVideos(chapterId);
     console.log('getVideos',this.filteredCourses);
  }
   ngOnDestroy(): void
  {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  filterCoursesByCategory(): void
    {
        
        if ( this.currentCategory === 'all' )
        {
            this.coursesFilteredByCategory = this.courses;
            this.filteredCourses = this.courses;
        }
        else
        {
            this.coursesFilteredByCategory = this.courses.filter((course) => {
                return course.category === this.currentCategory;
            });
            this.filteredCourses = [...this.coursesFilteredByCategory];
        }        
        this.filterCoursesByTerm();
    }

   
    filterCoursesByTerm(): void
    {
        const searchTerm = this.searchTerm.toLowerCase();

       
        if ( searchTerm === '' )
        {
            this.filteredCourses = this.coursesFilteredByCategory;
        }
        else
        {
            this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }

      addCourse(event){

     const dialogRef = this.dialog.open(AddVideoCourseComponent, {
      width: '60%',
      data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }],video_type:'training'  }
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
