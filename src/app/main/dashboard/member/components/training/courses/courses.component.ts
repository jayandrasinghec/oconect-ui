import { Component, OnInit,Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {CourseService } from '../../../../../../services/course.service'; 
import {AddcourseComponent} from '../../../../shared/addcourse/addcourse.component';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import LocalStorageService from 'app/services/localstorage.service';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
   animations : fuseAnimations
})
export class CoursesComponent implements OnInit {

    @Input() isCoOrdinator:boolean;
    @Input() chapter:any;

    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[]=[];
    currentCategory: string;
    searchTerm: string;    
    progress_color:any = '#00b81e';
    private _unsubscribeAll: Subject<any>;
  constructor(private toastr: ToastrService, 
              public dialog: MatDialog,
              private courseService: CourseService ,
              private router:Router,
              private activatedRoute : ActivatedRoute

             ) { 
        this.currentCategory = 'all';
        this.searchTerm = '';
        this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getCourses();
  }

  async getCourses()  {
        let user :any = LocalStorageService.getInstance().getJSONObject('OConnect-UserInfo');
        const isAdmin:boolean  = user.roles.filter(i => i.machine_name == 'master_admin').length > 0;
        
        const response:any = isAdmin ? await this.courseService.getCourses() : await this.courseService.getChapterCourses(this.chapter._id);
        if(response && !response.error){            
            
            console.log('user', user)
            let enrollIds :any;
            if(!isAdmin){
                const memberID:any = user.members[0]._id;
                const chapterID:any = this.activatedRoute.snapshot.paramMap.get('chapterID') ? 
                                            this.activatedRoute.snapshot.paramMap.get('chapterID') : user.members[0].chapter._id;
                enrollIds = await this.courseService.getEnrolID(memberID,chapterID);
            }
            for(let course of response)
            {
                if(!isAdmin){
                    let enrollId = enrollIds.find(x => x.course == course.entity._id)
                    if(enrollId){
                        course.enrollId = enrollId._id;
                    }
                }
                
                if(course.entity && course.entity['title']){
                    const obj:any =  JSON.parse(course.entity['title']);
                    course.displayTitle =  obj.langstring['#text'];
                }
                if(course.entity && course.entity['description']){
                    const obj1:any =  JSON.parse(course.entity['description']);
                    course.displayDescription =  obj1.langstring['#text'];
                }
            }
            this.filteredCourses =   this.courses = response ;
        }      
        console.log('getCourses   ', response);
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

     const dialogRef = this.dialog.open(AddcourseComponent, {
      width: '60%',
      data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }]  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
        this.toastr.success('Course created successfully.');
         this.getCourses();
                   
       }      
    });

  }
  launchCourse(course:any){
     console.log('course   ', course);
       if(course.entity) {
        LocalStorageService.getInstance().saveData(`${course.entity._id}:course`, JSON.stringify(course.entity));
         this.router.navigateByUrl(`${this.router.url}/course/${course.entity._id}/${course.enrollId}`)
        }
    
     
  }

}
