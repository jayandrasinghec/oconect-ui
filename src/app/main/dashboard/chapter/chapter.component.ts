import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/chapter-dashboard-navigation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
 
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd ,ParamMap} from '@angular/router';
import {AddchapterComponent} from '../shared/addchapter/addchapter.component';
import { InviteMemberComponent } from '../shared/invitemember/invitemember.component';
import LocalStorageService from '../../../services/localstorage.service';
import { ChapterService } from '../../../services/chapter.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { AddmemberComponent } from '../shared/addmember/addmember.component';
import { ToastrService } from 'ngx-toastr';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
  encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class ChapterComponent implements OnInit {

  fuseConfig: any;
  navigation: any;
  subChapters:any[]=[];   
  organisationObj:any;
  organisationID:any;
  chapterObj:any;
  chapterId : any;
  chapterName:any;
  navigationSubscription : Subscription;
  previousUrl : any;
  isAdmin : boolean = false;
  userInfo : any;

  private _unsubscribeAll: Subject<any>;
  constructor( private _fuseNavigationService:FuseNavigationService, 
              private _fuseConfigService: FuseConfigService,
              private chapterService:ChapterService,
               public dialog: MatDialog,
              private avtivatedRoute : ActivatedRoute,
              private router : Router,
              private cd: ChangeDetectorRef,
              private toastr: ToastrService) {
   this.navigation = navigation;   
    this._unsubscribeAll = new Subject();

  }

 
   ngOnInit(): void {
    this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
    this.userInfo = JSON.parse(this.userInfo);
     this.isAdmin =  this.userInfo.roles.filter(i => i.machine_name == 'master_admin').length > 0 || this.userInfo.members[0].isCoordinator;
     console.log('Router URL', this.router.url);
      this._fuseNavigationService.register('chapter', this.navigation);
      this._fuseNavigationService.setCurrentNavigation('chapter');




      this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
            this.fuseConfig = config;
            console.log('fuseConfig', this.fuseConfig);          
        }); 
        this.getOrganisation(); 

        this.avtivatedRoute.params.subscribe(params => {
            console.log('Chapter Params changes ',params);
             if(params){
                 this.getCurrentChapter();
                 this.getSubChapters();
             }
        });
        this.avtivatedRoute.firstChild.paramMap.subscribe(
			( params: any ) : void => {

			  console.log('Chapter Params changes ',params);
        if(params && params.params && params.params.chapterID){
           this.updateSideMenu(params.params);
        }
       

			}
		);
          
  }
  ngOnDestroy(): void
    {
     // this.navigationSubscription.unsubscribe();
       this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
  openDialog(event): void {
    if(this.organisationID == undefined){
      this. getOrganisation();
    }
    //if(this.chapterId==undefined){
      this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID') ||  this.chapterService.chapterID;
      this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName') ||  this.chapterService.chapterName;
    //}

    const dialogRef = this.dialog.open(AddchapterComponent, {
      width: '550px',
      data: {organisation:this.organisationID , chapterId:this.chapterId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
            this.subChapters.push(result.chapter);
            let navigateUrl = `dashboard/chapter/${this.chapterId}/${this.chapterName}/chapterlist`;    
            this.router.navigateByUrl(navigateUrl);
            this.chapterService.updateChapters(result);
       }      
    });
  }
  getOrganisation(){
    this.organisationObj = LocalStorageService.getInstance().getJSONObject('OConnect-Organisation');
    if(this.organisationObj){
      this.organisationID = this.organisationObj._id;
    }
  }
  getCurrentChapter(){
    this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');
    let chapters:any = LocalStorageService.getInstance().getJSONObject('OConnect-Chapters');
    console.log('chapters  ',chapters);
    if(chapters){
       this.chapterObj = chapters.find(item => item._id == this.chapterId);
    }
    console.log('this.chapterObj  ',this.chapterObj);
   
  }
  async  getSubChapters() {
        this.subChapters =[];
        this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName');          
        this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');          
         const response:any = await this.chapterService.getChapter(this.organisationID,this.chapterId);
         if(response ){
           
          this.subChapters = response.body[0].children;
         }
         console.log('getChapters  ',response);
  }

  chapterClickHandler(event, chapter){
    console.log('chapterClickHandler', chapter); 
    const navUrls:any[] =  LocalStorageService.getInstance().getJSONObject('OConnect_navigateUrl');
    navUrls.push(this.router.url);
    console.log('navUrls ',navUrls);
    LocalStorageService.getInstance().saveData('OConnect_navigateUrl',JSON.stringify(navUrls) );
    let navigateUrl = `dashboard/chapter/${chapter._id}/${chapter.name}`;    
    this.router.navigateByUrl(navigateUrl);
  }

  backButtonClickHandler(event){
    console.log('backButtonClickHandler', this.previousUrl);
     const navUrls:any[] =  LocalStorageService.getInstance().getJSONObject('OConnect_navigateUrl');
     this.previousUrl =  navUrls.pop();
     LocalStorageService.getInstance().saveData('OConnect_navigateUrl',JSON.stringify(navUrls));
     this.router.navigateByUrl(this.previousUrl);
  }
  inviteMember($event){
   if(this.chapterId==undefined){
        this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID') ||  this.chapterService.chapterID;
        this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName') ||  this.chapterService.chapterName;
   }
   const dialogRef = this.dialog.open(InviteMemberComponent, {
      width: '550px',
      data: {organisation:this.organisationID , chapters:[{name: this.chapterName ,id: this.chapterId  }] }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
        this.toastr.success('Email invite sent successfully.');
         let navigateUrl = `dashboard/chapter/${this.chapterId}/${this.chapterName}/memberlist`;    
         this.router.navigateByUrl(navigateUrl);
         this.chapterService.updateMembers(result);            
       }      
    });

  }

  addMember($event){    
      if(this.chapterId==undefined){
        this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID') ||  this.chapterService.chapterID;
       // this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName') ||  this.chapterService.chapterName;
        this.chapterName =  this.chapterService.chapterName;
      }
       const dialogRef = this.dialog.open(AddmemberComponent, {
          width: '550px',
          data: {organisation:this.organisationID , chapters:[{name: this.chapterName ,id: this.chapterId  }] }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed',result);
           if(result && result.submitClicked){
            this.toastr.success('Email sent successfully.');
            let navigateUrl = `dashboard/chapter/${this.chapterId}/${this.chapterName}/memberlist`;    
            this.router.navigateByUrl(navigateUrl);   
           }this.chapterService.updateMembers(result);                 
        });
    
      }
      updateSideMenu(chapter:any){
        this._fuseNavigationService.updateNavigationItem('chapters', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/chapterlist`        
        });
        this._fuseNavigationService.updateNavigationItem('members', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/memberlist`        
        });
         this._fuseNavigationService.updateNavigationItem('training', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/training`        
        });
         this._fuseNavigationService.updateNavigationItem('activity', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/activity`        
        });
         this._fuseNavigationService.updateNavigationItem('event', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/event`        
        });
         this._fuseNavigationService.updateNavigationItem('projects', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/projects`        
        });
        this._fuseNavigationService.updateNavigationItem('calender', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/calender`        
        });
        this._fuseNavigationService.updateNavigationItem('gradebook', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/gradebook`        
        });
       this._fuseNavigationService.updateNavigationItem('knowledgecenter', {
            url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/knowledgecenter`        
        });
        this._fuseNavigationService.updateNavigationItem('filemanagement', {
          url      : `/dashboard/chapter/${chapter.chapterID}/${chapter.chapterName}/filemanagement`        
      });


        
  }
 
}
