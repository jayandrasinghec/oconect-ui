import { Component, OnInit, Inject ,ViewEncapsulation,EventEmitter,ViewChild,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {UtilsService } from '../../../../services/Utils.service';
import {UploadService} from '../../../../services/upload.service';
import {CourseService} from '../../../../services/course.service';
import LocalStorageService from '../../../../services/localstorage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree/jqwidgets-ng-jqxtree';
import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton/jqwidgets-ng-jqxdropdownbutton';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
 import { HttpEvent, HttpEventType } from '@angular/common/http';
import{VideoProcessingService} from '../../../../services/videoprocessing.service';
@Component({
  selector: 'app-add-video-course',
  templateUrl: './add-video-course.component.html',
  styleUrls: ['./add-video-course.component.scss', '../../../../../../node_modules/jqwidgets-ng/jqwidgets/styles/jqx.base.css'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AddVideoCourseComponent implements OnInit {

  @ViewChild('videotag') videotag:any;
  @ViewChild('canvas') canvas:any;
  @ViewChild('thumnailImg') thumnailImg:any;
  @ViewChild('myTree', { static: false }) myTree: any;
	@ViewChild('myDropDownButton', { static: false }) myDropDownButton: jqxDropDownButtonComponent;
  @ViewChild('stepper', { static: false }) stepper:any;
  courseForm: FormGroup;
  showSpinner:boolean = false;
  chapters:any[];
  selectedChapter:any;

   /*------------------------*/
  options: UploaderOptions;
  formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;
   /*------------------------*/
  showTumbButton:boolean = false;


 /*-----------------------*/
  /*------------------------*/
	showSubmitButton:boolean =false;
	showUploadButton:boolean =false;
	uploadStatus:any = 'upload';

	/*------------------------------------*/
	dropFile:any;
	color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  chapterStructure:any[]=[];
  selectedChapters:any[]=[];
  userInfo :any;
	progress:any;
  
	videoUploadForm:FormGroup;
	videoThumImgUrl:any='';
	video_type:any; // Training video or knowledge center video

  
  constructor(private _formBuilder: FormBuilder,
      private cdr:ChangeDetectorRef,
      private uploadService:UploadService,
      private courseService:CourseService,
      private utilsService: UtilsService,
      private chapterService:ChapterService,
			private videprocService:VideoProcessingService,
      public dialogRef: MatDialogRef<AddVideoCourseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { 
         this.chapters = data.chapters;
				 this.video_type = data.video_type;
         this.selectedChapter =  this.chapters[0];
     }

  ngOnInit(): void {
    this.docUploaded = new EventEmitter();
	  this.options = { concurrency: 1, maxUploads: 1 , allowedContentTypes: ['video/mp4' , 'video/quicktime' , 'video/x-msvideo' ]  };
    this.files = [];  
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
		 this.videoUploadForm = this._formBuilder.group({
             videoUrl: ['', Validators.required],
            thumbnail: ['', Validators.required]
                   
        });
     this.courseForm = this._formBuilder.group({
            title: ['',Validators.required],
            description: ['',Validators.required],
            videoUrl: ['', Validators.required],
            thumbnail: ['', Validators.required],
            user: ['', Validators.required] ,
						duration:   ['']         
        });
      
      this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo');
      this.userInfo = JSON.parse(this.userInfo);
      this.courseForm.controls['user'].setValue(this.userInfo._id);
      
      
				const isAdmin:boolean  = this.userInfo.roles.filter(i => i.machine_name == 'master_admin').length > 0;
			  this.getChapters();
			if(isAdmin)
				{
					this.selectedChapter = null;
					this.getChapters();
				}
				else{
					//this.chapterStructure = [{id : this.selectedChapter.id, label : this.selectedChapter.name}];
					this.getChapters();
				}	
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
						if(this.selectedChapter ){
							if( item._id == this.selectedChapter.id){
								this.createChapterStructure(item);
							}							
						}
						else{
							this.createChapterStructure(item);
						}
						
						
					}
         }
				}				
	}

	createChapterStructure(item){
		if(item.weightage == 0 )
		{					
			
			if(item.children && item.children.length > 0)
			{
				let childs = this.appendChildren(item, new Array());
				this.chapterStructure.push(
					{
						id : item._id, label : item.name,
						items : childs
					}
				)
			}
			else{
				this.chapterStructure.push(
					{
						id : item._id, label : item.name
					}
				)
			}
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
				chapterStructure.push(
					{
						id : child._id, label : child.name,
						items : childs
					}
				)
			}
			else{			
				chapterStructure.push(
					{
						id : child._id, label : child.name
					}
				)
			}		
			
		}
		return chapterStructure;
	}
	myTreeOnSelect(event: any): void {
	if (this.myTree){
		const item = this.myTree.getItem(event.args.element);
		if(item.checked){
			if(!this.selectedChapters.find(x => x.id == item.id))
			this.selectedChapters.push({id:item.id, name:item.label});
		}
		else{
			if(this.selectedChapters && this.selectedChapters.length > 0){
				let uncheckedChapter =	this.selectedChapters.find(x => x.id == item.id);
				this.selectedChapters.splice(uncheckedChapter);

			}
		}
	}
 
}
  onUploadOutput(output: UploadOutput): void {
		switch (output.type) {
		  case 'allAddedToQueue':
         break;
		  case 'addedToQueue':
		 	if (typeof output.file !== 'undefined' ) {
			  this.files[0] = output.file;
				this.showUploadButton = true	;
       }
     // this.addVideoSource();
      break;
		  case 'uploading':
			if (typeof output.file !== 'undefined') {			   
			  const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
			  this.files[index] = output.file;
			}
			break;
		  case 'removed':		 
			this.files = this.files.filter((file: UploadFile) => file !== output.file);
			break;
		  case 'dragOver':
			this.dragOver = true;
			console.log('dragOver');
			break;
		  case 'dragOut':
		  case 'drop':
			this.dragOver = false;
			console.log('dragOut');
			break;
		  case 'done':		 
			console.log('done');

			break;
		}
 }
 addVideoSource(){
   
   this.videotag.nativeElement.src =  URL.createObjectURL(this.files[0].nativeFile ) ;
  // this.videotag.nativeElement.load();
  // this.cdr.detectChanges();

 }
 metaDataLoaded(event){
   this.showTumbButton  = true ; 
   this.videotag.nativeElement.currentTime = 1000;
   this.canvas.nativeElement.width = this.videotag.nativeElement.videoWidth;
   this.canvas.nativeElement.height = this.videotag.nativeElement.videoHeight;
   const ctx = this.canvas.nativeElement.getContext("2d");
  /* const _owner:any = this;
    setTimeout(()=>{
      ctx.drawImage(_owner.videotag.nativeElement , 0, 0, _owner.videotag.nativeElement.videoWidth, _owner.videotag.nativeElement.videoHeight);
      _owner.thumnailImg.nativeElement.src = _owner.canvas.nativeElement.toDataURL();
       _owner.cdr.detectChanges();
    },1000); */
}
addThumnail(){
  const ctx = this.canvas.nativeElement.getContext("2d");  
  ctx.drawImage(this.videotag.nativeElement , 0, 0, this.videotag.nativeElement.videoWidth, this.videotag.nativeElement.videoHeight);
  this.thumnailImg.nativeElement.src = this.canvas.nativeElement.toDataURL();
 // this.showTumbButton  = false ; 
}
/*------------------------- 
First uploads thumb nail Image
Seconed uploads Video
 -------------------------*/
  async startUpload(event) {
		 	if (this.files && this.files.length > 0) {
				  this.uploadStatus ='progress';
          const file:any = this.files[0];
         // this.addThumnail();
				 this.videprocService.generateThumbnail(file).then(async (thumbnailData) => {
						//console.dir(thumbnailData);
							   this.videoThumImgUrl = thumbnailData;

										/* ---------video thumbnail upload--------------*/
								const filename = 'video-thumbnails/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(`video-thumbnail.jpeg`));
								const objSend = this.getUploadObj(filename , 'image/jpeg');	  
								const thumbSignedURLRes:any = await this.uploadService.getSignedUrl(objSend);
								this.uploadService.uploadfileToS3(thumbSignedURLRes,this.getFileObject(thumbnailData) , 'image/jpeg' ).subscribe((event: HttpEvent<any>)=>{
									switch (event.type) {
											case HttpEventType.UploadProgress:
											this.progress = Math.round(event.loaded / event.total * 100);
											if(this.progress>= 100){								 
												this.showUploadButton =false;
												// this.videoThumImgUrl = thumbSignedURLRes.split('?')[0]; 
												   this.videoThumImgUrl = thumbnailData;    
											}
											break;
											}
								})
							// console.log('uploadResponse   ',uploadThumbnail);
								const thumbnailPath = thumbSignedURLRes.split('?')[0];					
								this.videoUploadForm.controls['thumbnail'].setValue(thumbnailPath);
								this.courseForm.controls['thumbnail'].setValue(thumbnailPath);
								/* --------------------------------------------*/

								/* ---------video thumbnail upload--------------*/
								const video_filename = 'videos/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(file.nativeFile.name));
								const videoObjSend = this.getUploadObj(video_filename , file.type );	  
								const videoSignedURLRes:any = await this.uploadService.getSignedUrl(videoObjSend);
								this.uploadService.uploadfileToS3(videoSignedURLRes,file.nativeFile,file.type ).subscribe((event: HttpEvent<any>)=>{
									switch (event.type) {
											case HttpEventType.UploadProgress:
											this.progress = Math.round(event.loaded / event.total * 100);
											if(this.progress>= 100){
												this.showSubmitButton = true;
												this.showUploadButton =false;
											}
											break;
											}
								});
							
								const videoPath = videoSignedURLRes.split('?')[0];       
								this.videoUploadForm.controls['videoUrl'].setValue(thumbnailPath);   
								this.courseForm.controls['videoUrl'].setValue(videoPath);       
								/* --------------------------------------------*/  
					});

                 
	   	}
  }
	continue(event){
		this.stepper.next();
	}
  async submit(event){
		let response:any 
    if(this.courseForm.valid){
						if( this.video_type=='training'){
								const chapters:any = 	this.selectedChapters.map( item => item.id);
								const data:any = Object.assign(this.courseForm.value,{chapters:chapters});
								console.log('data  ',data);
								response = await this.courseService.createVideoByChapters(data);
						}else{
							 response = await this.courseService.createVideo(this.courseForm.value);
						}     
						if(response && response._id){          
							this.dialogRef.close({ submitClicked: true, response :response });
						}
        console.log('create video response  ',response);

    }

  }
 	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}
  getFileObject(thumbnailData:any){
    
 //   let dataUrl = this.thumnailImg.nativeElement.src.split(',')
    let dataUrl =thumbnailData.split(',') ;
    let base64 = dataUrl[1];
    let mime = dataUrl[0].match(/:(.*?);/)[1];
    let bin = atob(base64);
    let length = bin.length;  
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);
    bin.split('').forEach((e,i)=>arr[i]=e.charCodeAt(0));  
    return  new File([buf],'filename',{type:mime}); 
  }

}
