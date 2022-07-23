import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation,Input,SimpleChanges,Output ,EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject,of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import {ActiveUserListService} from '../../../../../services/active-userlist.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChapterService } from '../../../../../services/chapter.service';
import { User } from '../../../../../core/model/user.model';

@Component({
  selector: 'app-activelist',
  templateUrl: './activelist.component.html',
  styleUrls: ['./activelist.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations

})
export class ActivelistComponent implements OnInit, AfterViewInit {
      
      @Input() userlist:any;
      @Input() changedUser:any;
      @Input() chapterId:any;
      @Input() updated:any;
      @Output() listChanged = new EventEmitter();

    contacts: any;
    user: any;
    displayedColumns = ['checkbox', 'avatar', 'email', 'username', 'mobile', 'isCoordinator', 'accept','buttons'];
    dataSource: User[] = [];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  
 
  constructor(private _usersService: ActiveUserListService,
              public _matDialog: MatDialog,
              private chapterService:ChapterService ) { 
          
          this._unsubscribeAll = new Subject();        

  }

  ngOnInit(): void {

    

  }
  ngOnChanges(changes:SimpleChanges)
  {
    if(changes && changes.changedUser && changes.changedUser.currentValue){
        // this._usersService.getContacts();
        // this._usersService.updateContactsData(changes.changedUser.currentValue);
        this.dataSource = this.dataSource.concat(changes.changedUser.currentValue);
       
    }
    if(changes && changes.chapterId && changes.chapterId.currentValue){        
       // this._usersService.getContacts();
       //  this._usersService.fetchContactsOnChapterChanged(changes.chapterId.currentValue);      
   }
    if(changes && changes.updated && changes.updated.currentValue){
       //  this.getActiveMembers();
     }
   if(changes && changes.userlist && changes.userlist.currentValue){
       //  this.getActiveMembers();
       this.setUpdataSource(changes.userlist.currentValue);
     }

  }
  /*
  async getActiveMembers(){
        
     const response:any = await this.chapterService.getActiveMembes();
     const users:any = response.filter(_contact =>  _contact.active == true);
     this.dataSource = users.map((item)=>{  return new User(item);})
  }
*/
  ngAfterViewInit(){
    this._usersService.chapterID = this.chapterId;
   // this.setUpdataSource();
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
/*
  setUpdataSource(){
     this.getActiveMembers();   
   //  this.dataSource = new FilesDataSource(this._usersService);
     this._usersService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                console.log('contacts', contacts);
                this.contacts =[];
                this.contacts = contacts;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._usersService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedContacts.includes(id);
                }
                this.selectedContacts = selectedContacts;
            });

        this._usersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._usersService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._usersService.deselectContacts();
            });
  }*/
   ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
   }
 editContact(contact): void
    {
       
    }
 deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._usersService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }
  onSelectedChange(contactId): void
    {
        this._usersService.toggleSelectedContact(contactId);
    }
  toggleStar(contactId): void
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._usersService.updateUserData(this.user);
    }
     async blockBtnClickhandler(event,user){
            if(user.active ==1 ) {
                  const data:any = {
                    "id":user.id ,
                    "active":0
                  }
                  const res:any = await this._usersService.approve(data);
                  if(res && res._id && res.active == 0){
                    // this._usersService.getContacts();
                    
                    this.dataSource = this.dataSource.filter(item => item.id != user.id);
                    console.log(' this.dataSource ', this.dataSource);
                    this.listChanged.emit({user:new User(res)});
                  }
                  console.log('blockBtnClickhandler ',res);
            } 
    }

}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _usersService
     */
    constructor(
        private _usersService: ActiveUserListService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._usersService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}

