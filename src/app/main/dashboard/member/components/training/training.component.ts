import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import LocalStorageService from '../../../../../services/localstorage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {AddcourseComponent} from '../../../shared/addcourse/addcourse.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  animations : fuseAnimations
})
export class TrainingComponent implements OnInit {

    userInfo  : any;
    isCoOrdinator:boolean = false;
    chapter:any; 
  constructor(private toastr: ToastrService, public dialog: MatDialog,private avtivatedRoute : ActivatedRoute,) {        

   }

  ngOnInit(): void {
      this.configUser();   

  }
  configUser(){
      this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
      this.userInfo = JSON.parse(this.userInfo);
      const members:any = this.userInfo.members;
      const userID:any = this.userInfo._id;
      const user : any = members.find(item=> item.user == userID);
      if(user){
        this.chapter = user.chapter ;        
      }
      else{            
        let chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName');          
        let chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');
        this.chapter = {_id : chapterId , name : chapterName}
      }
        this.isCoOrdinator  = (members.length > 0 && members[0].isCoordinator) || (this.userInfo.roles.filter(i => i.machine_name == 'master_admin').length > 0) ;
        console.log('this.isCoOrdinator  ',this.isCoOrdinator);
  }
 
 

}
