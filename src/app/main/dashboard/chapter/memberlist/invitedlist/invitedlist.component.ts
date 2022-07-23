import { Component, OnDestroy, OnInit, TemplateRef,SimpleChanges, ViewChild,Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import {MemberListService} from '../../../../../services/memberlist.service';
import {ChapterService} from '../../../../../services/chapter.service' 
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Member } from '../../../../../core/model/member.model';
import LocalStorageService from '../../../../../services/localstorage.service';
@Component({
  selector: 'app-invitedlist',
  templateUrl: './invitedlist.component.html',
  styleUrls: ['./invitedlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class InvitedlistComponent implements OnInit {

    contacts: any;
    user: any;
  //  dataSource: FilesDataSource | null;
    dataSource: any;
    displayedColumns = ['checkbox', 'avatar', 'email', 'status', 'coordinator', 'chapter','buttons'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @Input() updated:any;
  constructor(private _contactsService: MemberListService,
              private chapterService:ChapterService,
               public _matDialog: MatDialog,
               private _fuseNavigationService:FuseNavigationService
               ) {
                   this._unsubscribeAll = new Subject();
                }

  ngOnInit(): void {
    this.setUpDataSource();
  }
   ngOnChanges(changes:SimpleChanges)
  {
    if(changes && changes.updated && changes.updated.currentValue){
         this.getInvitedMembers();
     }
   
  }
  setUpDataSource(){
    // this.dataSource = new FilesDataSource(this._contactsService);
    this.getInvitedMembers();
     this._contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._contactsService.onSelectedContactsChanged
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

        this._contactsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
            });
  }
  async getInvitedMembers() {
    const user:any = LocalStorageService.getInstance().getJSONObject('OConnect-UserInfo');
    const response:any = await this.chapterService.getInvitedMembes(user._id);
    this.dataSource = response.map((item)=>{  return new Member(item);})
    
  }
  editContact(contact): void
    {
       
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
        this._contactsService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
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

        this._contactsService.updateUserData(this.user);
    }

}
export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        private _contactsService: MemberListService
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
        return this._contactsService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
