import { fuseAnimations } from '@fuse/animations';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChapterService } from '../../../../services/chapter.service';
import { User } from '../../../../core/model/user.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import LocalStorageService from '../../../../services/localstorage.service';
import { Member } from '../../../../core/model/member.model';
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class MemberlistComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;
    chapterName:any;
    chapterId:any;
    nonActiveUser:any  ;
    activeUser:any ;
    selectedIndex:any = 0;
    membersSubscription:Subscription; 
    invitememberUpdate:boolean = false;
    activememberUpdate:boolean = false;
    activeUsers:User[];
    nonactiveUsers:User[];
    invitedUsers:Member[];
  constructor( public _matDialog: MatDialog,
               private _fuseNavigationService:FuseNavigationService,
               private avtivatedRoute : ActivatedRoute,
               private chapterService:ChapterService ) {
                  this._unsubscribeAll = new Subject();
                }

  ngOnInit(): void {
    this.avtivatedRoute.params.subscribe(params => {
            console.log('Params changes ',params);
             if(params){
                this.getmembers();
                this.getInvitedMembers();
             }
        });
  }
  async  getmembers(){
     const response:any = await this.chapterService.getMembers();
     
     let coordinators:any = response.filter(item => item.members[0].isCoordinator == true);     
     const active_users:any = coordinators.filter(_contact =>  _contact.active == true);
     this.activeUsers = active_users.map((item)=>{  return new User(item);})
     const nonactive_users:any = coordinators.filter(_contact =>  _contact.active == false);
     this.nonactiveUsers = nonactive_users.map((item)=>{  return new User(item);})
     console.log(' this.activeUsers  ', this.activeUsers);
     console.log(' this.nonactiveUsers  ', this.nonactiveUsers);
  }
   async getInvitedMembers() {
    const user:any = LocalStorageService.getInstance().getJSONObject('OConnect-UserInfo');
    const response:any = await this.chapterService.getInvitedMembes(user._id);
    console.log('getInvitedMembersresponse  ',response);
    const invitedCoordinators:any =  response.filter(item => item.isCoordinator == true && item.status == 0 );
    this.invitedUsers = invitedCoordinators.map((item)=>{  return new Member(item);})
  }
   activeMemberlistChange(event){
    this.nonActiveUser = event.user;
    //this.getmembers();
  }
  nonactiveMemberlistChange(event){
    this.activeUser = event.user;
    //this.getmembers();
  }

}
