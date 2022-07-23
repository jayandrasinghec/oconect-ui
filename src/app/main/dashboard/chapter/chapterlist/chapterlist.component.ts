import LocalStorageService from '../../../../services/localstorage.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ChapterService } from '../../../../services/chapter.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-chapterlist',
  templateUrl: './chapterlist.component.html',
  styleUrls: ['./chapterlist.component.scss']
})
export class ChapterlistComponent implements OnInit {
  subChapters:any[]=[];   
  organisationObj:any;
  organisationID:any;
  chapterObj:any;
  chapterId : any;
  chapterName:any;
  chapterMembers:any;
  membersProfile:any[];
  userInfo:any;
   private chapterSubscription:Subscription; 
  constructor( private _fuseNavigationService:FuseNavigationService, 
              private chapterService:ChapterService,             
              private avtivatedRoute : ActivatedRoute,
              private router : Router,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {    
    this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
    this.userInfo = JSON.parse(this.userInfo);
     this.getOrganisation(); 
     this.subscribeChapterEvent();
      this.avtivatedRoute.params.subscribe(params => {
            console.log('Params changes ',params);
             if(params){
                 this.getCurrentChapter();
                 this.getSubChapters();
              //   this.updateSideMenu()
                 this.getChapterMembers();
             }
        });
  }
  ngDestroy(){
    if( this.chapterSubscription ){
       this.chapterSubscription.unsubscribe();
       this.chapterSubscription  = null;
    }
  }
  updateSideMenu(){
    this._fuseNavigationService.updateNavigationItem('chapters', {
        url      : `/dashboard/chapter/${this.chapterId}/${this.chapterName}/chapterlist`        
    });
      this._fuseNavigationService.updateNavigationItem('members', {
        url      : `/dashboard/chapter/${this.chapterId}/${this.chapterName}/memberlist`        
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
   subscribeChapterEvent(){
    this.chapterSubscription = this.chapterService.updateChaptersData$.subscribe((response:any)=>{
        if(response && response.chapter){
          this.subChapters.push(response.chapter);
          console.log(' response  ',  response.chapter);
          console.log(' this.chapters  ', this.subChapters );
        } 
    });
  }
  async  getSubChapters() {
        this.chapterName = this.avtivatedRoute.snapshot.paramMap.get('chapterName');          
        this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');     
        this.chapterService.chapterID =   this.chapterId;
        this.chapterService.chapterName =   this.chapterName;
         const response:any = await this.chapterService.getChapter(this.organisationID,this.chapterId);
         if(response ){
           
          this.subChapters = response.body[0].children;
         }
         console.log('getChapters  ',response);
  }

  async  getChapterMembers() {      
    this.chapterId = this.avtivatedRoute.snapshot.paramMap.get('chapterID');     
     const response:any = await this.chapterService.getUsers();
     if(response ){
      this.chapterMembers = response.filter(x => x.members[0].chapter == this.chapterId && x._id != this.userInfo._id)
      this.membersProfile = new Array();
      for(let member of this.chapterMembers)
      {
        if(member.profile){
          let profileImage = member.profile.photo && member.profile.photo.url ? member.profile.photo.url: 'assets/images/avatars/profile.jpg';
          let name = member.profile.firstname + ' ' + member.profile.lastname;
          this.membersProfile.push({photo : profileImage, name : name, isCoordinator : member.members[0].isCoordinator}); 
        }       
          
      }
     }
     
}

  chapterClickHandler(event, chapter){
    console.log('chapterClickHandler', chapter); 
    const navigateUrls : any[] = LocalStorageService.getInstance().getJSONObject('OConnect_navigateUrl')
    const navUrls:any[] = navigateUrls ? navigateUrls : new Array();
    navUrls.push(this.router.url);
    console.log('navUrls ',navUrls);
    LocalStorageService.getInstance().saveData('OConnect_navigateUrl',JSON.stringify(navUrls) );
    let navigateUrl = `dashboard/chapter/${chapter._id}/${chapter.name}/chapterlist`;    
    this.router.navigateByUrl(navigateUrl);
  }

}
