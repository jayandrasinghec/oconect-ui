import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChapterService } from '../../../../services/chapter.service';
import LocalStorageService from '../../../../services/localstorage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-chapterlist',
  templateUrl: './chapterlist.component.html',
  styleUrls: ['./chapterlist.component.scss']
})
export class ChapterlistComponent implements OnInit, AfterViewInit
 {
  chapters:any[]=[];
  organisationObj:any;
  organisationID:any;
  chapterCoordinators : any;
  membersProfile: any[];

  private chapterSubscription:Subscription; 
  constructor(private chapterService:ChapterService, private router : Router) { }

  ngOnInit(): void {
    //  this.getOrganisation();
    //  this.getChapters(); 
    //  this.getChapterCoordinators();
    //  this.subscribeChapterEvent();
  }
  ngDestroy(){
      if(this.chapterSubscription){
        this.chapterSubscription.unsubscribe();
        this.chapterSubscription = null;
      }
  }

  ngAfterViewInit(){
    this.getOrganisation();
    this.getChapters(); 
    this.getChapterCoordinators();
    this.subscribeChapterEvent();
  }


  getOrganisation(){
    this.organisationObj = LocalStorageService.getInstance().getJSONObject('OConnect-Organisation');
    if(this.organisationObj){
      this.organisationID = this.organisationObj._id;
       
    }
  }
  async getChapters() {    
         const response:any = await this.chapterService.getChapterByWeightage(this.organisationID,0);
         if(response && response.length>0){
          this.chapters = response.filter(item => item.weightage == 0);
          LocalStorageService.getInstance().saveData('OConnect-Chapters',JSON.stringify( [this.chapters]));
         }
         console.log('getChapters  ',response);
  }
  subscribeChapterEvent(){
    this.chapterSubscription = this.chapterService.updateChaptersData$.subscribe((response:any)=>{
        if(response && response.chapter && response.chapter.weightage == 0){
          this.chapters.push(response.chapter);
          console.log(' response  ',  response.chapter);
          console.log(' this.chapters  ', this.chapters );
        } 
    });
  }


  async  getChapterCoordinators() {         
     const response:any = await this.chapterService.getUsers();
     if(response ){
      this.chapterCoordinators = response.filter(x => x.members[0].isCoordinator == true)
      this.membersProfile = new Array();
      for(let member of this.chapterCoordinators)
      {
        if(member.profile){
          let profileImage = member.profile.photo && member.profile.photo.url ? member.profile.photo.url: 'assets/images/avatars/profile.jpg';
          let name =  member.profile.firstname + ' ' + member.profile.lastname ;
          this.membersProfile.push({photo : profileImage, name : name , chapterName : ''});        
        }
          
      }
      console.log('getChapterCoordinators', response, this.chapterCoordinators)
     }
     
}

   chapterClickHandler(event, chapter){
    console.log('chapterClickHandler', chapter);
    LocalStorageService.getInstance().saveData('OConnect_navigateUrl',JSON.stringify([this.router.url]) );
    let navigateUrl = `dashboard/chapter/${chapter._id}/${chapter.name}/chapterlist`;
    this.router.navigateByUrl(navigateUrl);

  }

}
