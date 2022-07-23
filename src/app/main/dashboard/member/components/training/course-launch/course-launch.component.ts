import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../../../../services/course.service';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import LocalStorageService from '../../../../../../services/localstorage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CourseWindowComponent } from '../../../../shared/course-window/course-window.component';
@Component({
  selector: 'app-course-launch',
  templateUrl: './course-launch.component.html',
  styleUrls: ['./course-launch.component.scss']
})
export class CourseLaunchComponent implements OnInit {
  User:any;
  enrollId:any;
  course:any
  title:any;
  description:any;
  constructor(private courseService:CourseService,
              private activatedRoute:ActivatedRoute,
               public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.getUser();
    // this.getEnrollID();
    this.enrollId = this.activatedRoute.snapshot.paramMap.get('enrollId');
    let courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
    let rawCourse = LocalStorageService.getInstance().getItem(`${courseId}:course`);
    this.course = JSON.parse(rawCourse);

    const obj:any =  JSON.parse(this.course['title']) ;
    console.log('title ', obj.langstring['#text']);
    this.title =  obj.langstring['#text'];

    
    const obj1:any =  JSON.parse(this.course['description']) ;
    console.log('description ', obj.langstring['#text']);
    this.description =  obj1.langstring['#text'];
  }
  getUser(){
    this.User = LocalStorageService.getInstance().getJSONObject('OConnect-UserInfo');
  }
  async getEnrollID(){
    const memberID:any = this.User._id;
    const chapterID:any = this.activatedRoute.snapshot.paramMap.get('chapterID');
    const reponse:any = await this.courseService.getEnrolID(memberID,chapterID);
    console.log('reponse   ',reponse);
  }

  launchCourse(event){
    if(this.enrollId){
      window.open(`http://localhost:3004/launch/${this.enrollId}`)
    }


    //  const dialogRef = this.dialog.open(CourseWindowComponent, {
    //   width: '650px',
    //   data: {  }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed',result);
    //    if(result && result.submitClicked){
       
                   
    //    }      
    // });

  }

}
