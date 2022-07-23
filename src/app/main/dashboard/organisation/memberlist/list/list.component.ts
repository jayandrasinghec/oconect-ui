import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation,Input,SimpleChanges,Output ,EventEmitter, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { User } from '../../../../../core/model/user.model';
import {ActiveUserListService} from '../../../../../services/active-userlist.service';
import {NonActiveUserListService} from '../../../../../services/nonactive-userlist.service';
@Component({
  selector: 'app-member-list-table',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations

})
export class ListComponent implements OnInit {

  @Input() memberType:any;
  @Input() userlist: any;
  @Input() changedUser: any;
  @Input() chapterId: any;  
  @Output() listChanged = new EventEmitter();
  displayedColumns = ['checkbox', 'avatar', 'email', 'username', 'mobile', 'chapter',  'isCoordinator', 'accept','buttons'];
  dataSource: User[] = [];
  checkboxes: {};
  constructor(private activeuserService:ActiveUserListService,
              private nonactiveuserService:NonActiveUserListService,
              ) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes:SimpleChanges)
  {
    if(changes && changes.changedUser && changes.changedUser.currentValue){
       this.dataSource = this.dataSource.concat(changes.changedUser.currentValue);
    }    
   if(changes && changes.userlist && changes.userlist.currentValue){
       //  this.getActiveMembers();
       this.setUpdataSource(changes.userlist.currentValue);
     }

  }
  setUpdataSource(userlist:any){
      this.dataSource = [] ;
      this.dataSource = userlist;
      console.log('this.dataSource   :',this.dataSource);
      this.checkboxes = {};
      userlist.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
  }
  editContact(contact): void
    {
       
    }
 deleteContact(contact): void
    {

    }
    onSelectedChange(contactId): void
    {
        
    }
    toggleStar(contactId): void
    {
    
    }
    async blockBtnClickhandler(event,user){
            if(user.active ==1 ) {
                  const data:any = {
                    "id":user.id ,
                    "active":0
                  }
                  const res:any = await this.activeuserService.approve(data);
                  if(res && res._id && res.active == 0){
                    // this._usersService.getContacts();
                    
                    this.dataSource = this.dataSource.filter(item => item.id != user.id);
                    console.log(' this.dataSource ', this.dataSource);
                    this.listChanged.emit({user:new User(res)});
                  }
                  console.log('blockBtnClickhandler ',res);
            } 
    }
    async approveBtnClickhandler(event,user){
            if(user.active ==0 ) {
                  const data:any = {
                    "id":user.id ,
                    "active":1
                  }
                  console.log('approveBtnClickhandler data  ',data);
                  const res:any = await this.nonactiveuserService.approve(data);
                  if(res && res._id && res.active ==1){
                   // this._usersService.getContacts();
                   this.dataSource = this.dataSource.filter(item => item.id != user.id);
                   console.log(' this.dataSource ', this.dataSource);
                   this.listChanged.emit({user:new User(res)});
                  }
                  console.log('approveBtnClickhandler ',res);
            } 
    }

}
