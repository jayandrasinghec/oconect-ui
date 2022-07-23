
import { Component, ViewChild, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree/jqwidgets-ng-jqxtree';
import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton';
import LocalStorageService from 'app/services/localstorage.service';
import { ChapterService } from 'app/services/chapter.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AddVideoCourseComponent} from '../add-video-course/add-video-course.component';
import { AddOtherCourseComponent } from '../add-other-course/add-other-course.component';
import { FileManagementService } from 'app/services/filemanagement.service';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss' , '../../../../../../node_modules/jqwidgets-ng/jqwidgets/styles/jqx.base.css'],
  encapsulation: ViewEncapsulation.None,
    animations : fuseAnimations,
})
export class FileManagementComponent implements OnInit, AfterViewInit {
    @ViewChild('treeReference', { static: false }) tree: jqxTreeComponent;
    chapters : any[];
    chapterStructure  : any[];
    fileStructure : any[];
    folderIcon : any = "../../../../../assets/images/others/folder.png";
    docIcon : any = "../../../../../assets/images/icon/icon-2.png";
    videoIcon : any = "../../../../../assets/images/icon/icon-5.png";
    slideIcon : any = "../../../../../assets/images/icon/icon-1.png";
    sheetIcon : any = "../../../../../assets/images/icon/icon-3.png";
    imageIcon : any = "../../../../../assets/images/icon/icon-4.png";
    pdfIcon : any = "../../../../../assets/images/others/pdf.png";

    userInfo  : any;
    isCoOrdinator:boolean = false;
    chapter:any; 
    isGridView:boolean = true;
    showGridBtn:boolean = false;
     displayedColumns = ['icon', 'name', 'type', 'modified', 'detail-button','edit-button'];
    constructor(private chapterService : ChapterService,
      private toastr: ToastrService, 
      public dialog: MatDialog,private avtivatedRoute : ActivatedRoute,
      private fileManagementService : FileManagementService){

    }

    ngOnInit(): void {
      this.configUser();
      this.getChapters()
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.tree.selectItem(null);
        });
    }

    myTreeOnSelect(event: any): void {
      if (this.tree ) {
          this.showGridBtn = true;
          const item:any = this.tree.getSelectedItem();
          console.log('item', item)
          if(item.label == "Documents"){
            this.getDocuments(item.id);
          }
          else if(item.label == "Videos"){
            this.getVideos(item.id);
          }
      }
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

    async getChapters() {
      let organisationObj : any = LocalStorageService.getInstance().getJSONObject('OConnect-Organisation');
      if(organisationObj){
           const response:any = await this.chapterService.getOrgChapters(organisationObj._id);
           if(response && !response.error){
            this.chapters = response.body;// response.filter(item => item.weightage == 0);
            LocalStorageService.getInstance().saveData('OConnect-Chapters',JSON.stringify( [this.chapters]));
            this.chapterStructure = new Array();
            for(let item of this.chapters)
            {
              if(item.weightage == 0)
              {					
                
                if(item.children && item.children.length > 0)
                {
                  let childs = this.appendChildren(item, new Array());
                  childs.push(
                      {
                        id : item._id, type : 'docs', label : 'Documents', icon: this.docIcon
                      },
                      {
                        id : item._id, type : 'videos', label : 'Videos', icon: this.videoIcon
                      }
                  )
                  this.chapterStructure.push(
                    {
                      id : item._id, type : 'folder', label : item.name, icon: this.folderIcon,
                      items : childs
                    }
                  )
                }
                else{
                  this.chapterStructure.push(
                    {
                      id : item._id, type : 'folder', label : item.name, icon: this.folderIcon,
                      items : [
                        {
                          id : item._id, type : 'docs', label : 'Documents', icon: this.docIcon
                        },
                        {
                          id : item._id, type : 'videos', label : 'Videos', icon: this.videoIcon
                        }
                      ]
                    }
                  )
                }
              }
              
            }
            //this.fileStructure = this.chapterStructure;
            console.log('chapterStructure  ', this.chapterStructure);
           }
           console.log('getChapters  ',response);
          }				
    }
    
    appendChildren(parent: any, chapterStructure:any[]){
      for(let child of parent.children)
      {
        if(!child._id)
        {
          child = this.chapters.find(x => x._id == child);			
        }
    
        if(child.children && child.children.length > 0){
          
          let childs = this.appendChildren(child, new Array());
          childs.push(   
            {
              id : child._id, type : 'docs', label : 'Documents', icon: this.docIcon
            },
            {
              id : child._id, type : 'videos', label : 'Videos', icon: this.videoIcon
            }
          )
          chapterStructure.push(
            {
              id : child._id, type : 'folder', label : child.name, icon: this.folderIcon,
              items : childs
            }
          )
        }
        else{			
          chapterStructure.push(
            {
              id : child._id, type : 'folder', label : child.name, icon: this.folderIcon,
              items : [
                {
                  id : child._id, type : 'docs', label : 'Documents', icon: this.docIcon
                },
                {
                  id : child._id, type : 'videos', label : 'Videos', icon: this.videoIcon
                }
              ]

            }
          )
        }		
        
      }
      return chapterStructure;
    }
  
    async getDocuments(chapterId : any){
      const response:any = await this.fileManagementService.getDocuments(chapterId);
      console.log('getDocuments', response);
      if(response && !response.error){
        this.fileStructure = new Array();
        for(let item of response)
        {
          this.fileStructure.push(
            {
              id : item.entity.file.id, 
              label : item.entity.file.filename, 
              icon : this.getDocumentIcon(item.entity.type), 
              url:item.entity.file.url,
              type : item.entity.type,
              updatedAt:item.updatedAt
            }
          )

        }
      }
    }

    async getVideos(chapterId : any){
      const response:any = await this.fileManagementService.getVideos(chapterId);
      console.log('getDocuments', response);
      if(response && !response.error){
        this.fileStructure = new Array();
        for(let item of response)
        {
          this.fileStructure.push(
            {
              id : item.entity.videoUrl._id, 
              label : item.entity.videoUrl.filename, 
              icon : this.videoIcon, 
              url:item.entity.videoUrl.url,
              type : item.entity.videoUrl.mimetype,
              updatedAt:item.updatedAt
            }
          )

        }
      }
    }
    
    fileClickHandler(event :any, item : any){
      // if(item.type == 'folder'){
      //   const chapter = this.chapterStructure.filter(x => x.id == item.id);
      //   this.fileStructure = chapter[0].items;
      // }
      // else if(item.type == 'docs')
      // {
      //   this.getDocuments(item.id)
      // }
      // else if(item.type == 'videos')
      // {

      // }
      // else{
        window.open(item.url, "_blank");
      //}
      
   }
   editClickHandler(event :any, item : any){

   }
   deleteClickHandler(event :any, item : any){

   }
  
   addVideo(event){

     const dialogRef = this.dialog.open(AddVideoCourseComponent, {
      width: '60%',
      data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }],video_type:'training'  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.submitClicked){
        this.toastr.success('Video uploaded successfully.');
        // this.getVideos();
                   
       }      
    });
  }
   
  addDocument(event){
        
     const dialogRef = this.dialog.open(AddOtherCourseComponent, {
        width: '60%',
         data: { chapters:[{name: this.chapter.name ,id: this.chapter._id  }]  }
        });
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed',result);
        if(result && result.submitClicked){
            this.toastr.success('Course created successfully.');
          //  this.getDocuments();
         }      
        });
    }
    switchView(event, value){
      // this.isGridView = !this.isGridView ;
      this.isGridView = value ;
    }
    getDate_Time(timeString:any){	 
		let date = new Date(timeString);
		//console.log('date  : ',_dt.getFullYear() +'-'+ _dt.getMonth() + '-' + _dt.getDay());
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();

        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();

        let dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y + ' : ' + hour + ':' + min+ ':'+sec;
		return dateString;
  }
  
  getDocumentIcon(type : any){
    switch(type){
      case 'document' :
      {
        return this.docIcon;
      }
      case 'presentation' :
      {
        return this.slideIcon;
      }
      case 'pdf' :
      {
        return this.pdfIcon;
      }
      default :
      {
        return this.docIcon;
      }

    }
  }
    
}
