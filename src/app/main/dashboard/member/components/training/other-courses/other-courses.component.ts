
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy,Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {CourseService } from '../../../../../../services/course.service'; 
import { AddOtherCourseComponent } from '../../../../shared/add-other-course/add-other-course.component';

@Component({
  selector: 'app-other-courses',
  templateUrl: './other-courses.component.html',
  styleUrls: ['./other-courses.component.scss'],
    animations : fuseAnimations,
     
    
})
export class OtherCoursesComponent implements OnInit {

    @Input() isCoOrdinator:boolean;
    @Input() chapter:any;
    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[]=[];
    currentCategory: string;
    searchTerm: string;    
    private _unsubscribeAll: Subject<any>;

    files: any;
    dataSource: CourseMaterial[] | null;
    displayedColumns = ['icon', 'name', 'type', 'modified', 'detail-button'];
    selected: any;

    



  constructor(private toastr: ToastrService, 
              public dialog: MatDialog,
              private courseService: CourseService ,
              private router:Router,
              private activatedRoute : ActivatedRoute) {
        this.searchTerm = '';        
   }

  ngOnInit(): void {
      this.getDocuments();
     /* this.dataSource = [
        {
            'name'     : 'Work Documents',
            'type'     : 'picture_as_pdf',
            'owner'    : 'me',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Public Documents',
            'type'     : 'insert_chart',
            'owner'    : 'public',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Private Documents',
            'type'     : 'photo',
            'owner'    : 'me',
            'size'     : '',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
             'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Ongoing projects',
            'type'     : 'insert_chart',
            'owner'    : 'Emily Bennett',
            'size'     : '1.2 Mb',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
            'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
        {
            'name'     : 'Shopping list',
            'type'     : 'insert_chart',
            'owner'    : 'Emily Bennett',
            'size'     : '980 Kb',
            'modified' : 'July 8, 2017',
            'opened'   : 'July 8, 2017',
            'created'  : 'July 8, 2017',
            'extention': '',
            'location' : 'My Files > Documents',
            'offline'  : true,
            'preview'  : 'assets/images/file-manager/sample-file-preview.jpg'
        },
         
    ];*/
  }
  async getDocuments(){
    const response:any = await this.courseService.getDocuments(this.chapter._id);
    this.dataSource = response ;
    console.log('response  ', response);
  }
   ngOnDestroy(): void
  {
     
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
    addMaterial(event){
        
     const dialogRef = this.dialog.open(AddOtherCourseComponent, {
        width: '60%',
         data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }]  }
        });
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        if(result && result.submitClicked){
            this.toastr.success('Course created successfully.');
            this.getDocuments();
                    
        }      
        });
    }
    videDocument(url:any){
       window.open(url, "_blank");
    }
    getIcon(type:any){
        let _icon:any;
        switch(type){
            case 'presentation':
            _icon = 'insert_chart';
            break;
             case 'pdf':
            _icon = 'picture_as_pdf';
            break;
        }
        return _icon;
    }
    getDate_Time(timeString:any){	 
		let date = new Date(timeString);
		//console.log('date  : ',_dt.getFullYear() +'-'+ _dt.getMonth() + '-' + _dt.getDay());
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();

        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();

        let dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y + ' : ' + hour + ':' + min+ ':'+sec;
		return dateString;
	}

}


export interface CourseMaterial {
           
           _id:string;
           chapter:string;
           createdAt:string;
           createdBy:string;
           entity:any;
           onModel:any;
           trackmode:string;
            
}