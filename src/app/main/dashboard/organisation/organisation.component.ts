import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service'; 
import { fuseAnimations } from '@fuse/animations';

import { navigation } from 'app/navigation/org-dashboard-navigation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddchapterComponent } from '../shared/addchapter/addchapter.component';
import { Router } from '@angular/router';
 
import LocalStorageService from '../../../services/localstorage.service';
import { ChapterService } from '../../../services/chapter.service';
import { OrganisationService } from 'app/services/organisation.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})

export class OrganisationComponent implements OnInit, OnDestroy {
  fuseConfig: any;
  navigation: any;
  chapters:any[]=[];
  organisationObj:any = {name:"", _id:null, logo: null};
  organisationID:any;
  organizationName:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor( private _fuseConfigService: FuseConfigService,
               private _fuseNavigationService:FuseNavigationService,
               private chapterService:ChapterService,
               private organizationService:OrganisationService,
               public dialog: MatDialog,
              private router : Router) {
    
    this.navigation = navigation;
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
      this._fuseNavigationService.register('organisation', this.navigation);
       this._fuseNavigationService.setCurrentNavigation('organisation');
      this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
            this.fuseConfig = config;
            console.log('fuseConfig', this.fuseConfig);
        });   
        this.getOrganisation(); 
        //this.getChapters();         
        LocalStorageService.getInstance().saveData('OConnect_navigateUrl', this.router.url);
        
  }

  ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
  openDialog(event): void {
      const dialogRef = this.dialog.open(AddchapterComponent, {
        width: '550px',
        data: {organisation: this.organisationObj._id }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        if(result && result.submitClicked){
            if(result.chapter.weightage == 0){
             this.chapterService.updateChapters(result);
            // this.chapters.push(result.chapter);
             let chapters:any = LocalStorageService.getInstance().getJSONObject('OConnect-Chapters');
             console.log('chapters ',chapters);
             if(chapters){
              chapters.push(result.chapter);              
             }
             else{
                chapters = [result.chapter];
             }
             LocalStorageService.getInstance().saveData('OConnect-Chapters',JSON.stringify(chapters));
        }   
      }   
      });
  }
  async getOrganisation(){
    this.organisationObj = LocalStorageService.getInstance().getJSONObject('OConnect-Organisation');
    if(this.organisationObj){
      this.organisationID = this.organisationObj._id; 
      //this.getChapters();      
    }    
  }

  async getChapters() {
    if(this.organisationObj && this.organisationObj._id){
      const response:any = await this.chapterService.getChapterByWeightage(this.organisationObj._id,0);
      if(response && response.length>0){
       this.chapters = response.filter(item => item.weightage == 0);
       LocalStorageService.getInstance().saveData('OConnect-Chapters',JSON.stringify( [this.chapters]));
      }
      console.log('getChapters  ',response);
    }
         
  }

  chapterClickHandler(event, chapter){
    console.log('chapterClickHandler', chapter);
    LocalStorageService.getInstance().saveData('OConnect_navigateUrl',JSON.stringify([this.router.url]) );
    let navigateUrl = `dashboard/chapter/${chapter._id}/${chapter.name}`;
    this.router.navigateByUrl(navigateUrl);

  }


}
