import { Component, OnInit } from '@angular/core';
import LocalStorageService from '../../../../../services/localstorage.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-knowledge-center',
  templateUrl: './knowledge-center.component.html',
  styleUrls: ['./knowledge-center.component.scss']
})
export class KnowledgeCenterComponent implements OnInit {
  userInfo:any;
  isCoOrdinator:boolean = false;
  chapter:any; 
  constructor(private avtivatedRoute : ActivatedRoute) { }

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
