import { Component, OnInit, Inject ,ViewEncapsulation,EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UploadService} from '../../../../services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { DragdropService } from 'app/services/dragdrop.service';
import {ChapterService} from '../../../../services/chapter.service';
import { CourseService } from '../../../../services/course.service';
import { DomSanitizer } from '@angular/platform-browser';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree/jqwidgets-ng-jqxtree';
import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton/jqwidgets-ng-jqxdropdownbutton';
import LocalStorageService from 'app/services/localstorage.service';
import { fuseAnimations } from '@fuse/animations';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {UtilsService } from '../../../../services/Utils.service';
 
@Component({
  selector: 'app-add-other-course',
  templateUrl: './add-other-course.component.html',
  styleUrls: ['./add-other-course.component.scss', '../../../../../../node_modules/jqwidgets-ng/jqwidgets/styles/jqx.base.css'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AddOtherCourseComponent implements OnInit {
  @ViewChild('myTree', { static: false }) myTree: any;
	@ViewChild('myDropDownButton', { static: false }) myDropDownButton: jqxDropDownButtonComponent;
	@ViewChild('stepper', { static: false }) stepper:any;
 
  courseUploadForm:FormGroup;
	courseDetailForm:FormGroup;
	enrolmentForm:FormGroup;

  selectedItem:any;
  filetypes:any[]= [{label:'PDF',value:'pdf'}, {label:'DOCS',value:'docs'}, {label:'POWER POINT',value:'ppt'},];
  dropFile:any;
  uploadStatus:any = 'upload';
  progress:any =0;
  chapters:any[];
  chapterStructure:any[];
  selectedChapters:any[] =[];
  selectedChapter:any;
  members:any[];
  selectedMembers:any[]=[];
  chapterMembers:any[];
	selectedChapterIndex:any=0;
  showUploadButton:boolean=false;
  showSpinner:boolean = false;
  uploadedData:any;
  created_course_id:any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  userInfo :any;
	/*------------------------*/
  options: UploaderOptions;
  formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;
   /*------------------------*/
	 course_upload_type:any;

  constructor(private _formBuilder: FormBuilder,
    private uploadService:UploadService,
		public dialogRef: MatDialogRef<AddOtherCourseComponent>,
		private toastr : ToastrService,
		public dragdropService: DragdropService,
		private chapterService : ChapterService,
		private courseService : CourseService,
		private sanitizer : DomSanitizer,
		private utilsService:UtilsService,	 
     @Inject(MAT_DIALOG_DATA) public data: any) { 

        this.chapters = data.chapters;
				this.selectedChapter =  this.chapters[0];			 
				this.selectedChapters = new Array();

     }

  ngOnInit(): void {
        this.configForms(); 
				this.configUpload();
        this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
				this.userInfo = JSON.parse(this.userInfo);
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
	configUpload(){
		this.docUploaded = new EventEmitter();
	  this.options = { concurrency: 1, maxUploads: 1 ,  };
    this.files = [];  
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
	}
	 onUploadOutput(output: UploadOutput): void {
		switch (output.type) {
		  case 'allAddedToQueue':
         break;
		  case 'addedToQueue':
		 	if (typeof output.file !== 'undefined' ) {
			  this.files[0] = output.file;
        	console.log('this.files   ', this.files );
       }
			 this.showUploadButton = true;
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
  fileTypeChange(event){

     this.courseUploadForm.controls['filetype'].setValue(event.value.value);
	 	 console.log('event   ',event,this.courseUploadForm.controls['filetype'].value);
  }

	/*
  fileDropped(event){
    this.dropFile = event;
		this.uploadStatus ='zipicon';
		this.showUploadButton = true;
  }
	*/
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
    this.courseDetailForm.controls['chapters'].setValue(this.selectedChapters);
    console.log('this.selectedChapters ',this.selectedChapters); 
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  startUpload(event) {
			console.log('this.files[]  ',this.files[0]);
		 	if (this.files && this.files.length > 0) {
						this.uploadStatus ='progress';
						const file:any = this.files[0];
						const fileTypeArr:any[] = ['ppt','pptx','doc','docx','xls']
						const fileExtn:any = file.name.split('.')[1];
						console.log('fileExtn  ',fileExtn);
						const fileTypematch:any = fileTypeArr.find(type => fileExtn.toString() == type  );
				    console.log('fileTypematch ',fileTypematch);
						if(fileTypematch){
							console.log('fileTypematch ',fileTypematch);
							this.course_upload_type = 'API';
							this.uploadByAPI(file.nativeFile);
						}else{
							this.course_upload_type = 'S3';
							this.uploadBYS3(file);
						}			
      }
  }
  async submitCourse(event){
			console.log('this.courseDetailForm.valid  ',this.courseDetailForm.valid,this.uploadedData);
							if(this.courseDetailForm.valid && this.uploadedData){
										this.showSpinner = true;
										const chapters = this.selectedChapters.map(item => item.id);	
										let data:any ;								 
										if(this.course_upload_type === 'API'){
											data = Object.assign({chapters:chapters,user:this.userInfo._id},this.uploadedData);
										}else{
											const _url:any = this.uploadedData.url.split('?')[0];
											const _name:any = this.files[0].nativeFile.name;
											data = {chapters:chapters,
															user:this.userInfo._id,
															type:'pdf',
															name:_name,
															mimeType:'application/pdf',
															url:_url}
										}										
										console.log('data  ',data);
										const response:any =await this.courseService.createDocument(data);
										console.log('response  ',response);
										if(response && !response.error){
											this.created_course_id = response[0]._id;
										  this.courseDetailForm.controls['chapters'].setValue(chapters);
												this.showSpinner = false;
												this.dialogRef.close({ submitClicked: true });
										//	this.getMembersinChapters();
										//	this.stepper.next();
										}

							}	

  }
	async uploadBYS3(file:any){
								console.log('upload by S3');
							  const filename = 'materials/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(file.name ));
								const objSend = this.getUploadObj(filename , file.type );	  
								const signedURLRes:any = await this.uploadService.getSignedUrl(objSend);
								console.log('uploadThumbnail  ',signedURLRes);
								this.uploadService.uploadfileToS3(signedURLRes,file.nativeFile,file.type  ).subscribe((event: HttpEvent<any>)=>{
									switch (event.type) {
											case HttpEventType.UploadProgress:
											this.progress = Math.round(event.loaded / event.total * 100);
											if(this.progress>= 100){								 
											  	//this.showUploadButton =false;			
													const thumbnailPath = signedURLRes.split('?')[0];					
												  //	this.courseUploadForm.controls['filetype'].setValue(thumbnailPath);
												  //	this.courseDetailForm.controls['thumbnail'].setValue(thumbnailPath);							 
								 			}
											console.log(`Uploaded! ${this.progress}%`);
											break;
											case HttpEventType.Response:						
											this.uploadedData = event;
											this.showUploadButton =false;	
											console.log('this.uploadedData ',this.uploadedData ,event);
										//	this.courseUploadForm.controls['filename'].setValue(this.uploadedData.filename);
										}
										
								})					 
							

	}
	async uploadByAPI(file:any){
	    	console.log('upload by api');
	    	this.uploadService.uploadtoGoogleDrive(file).subscribe((event: HttpEvent<any>)=>{
									switch (event.type) {
											case HttpEventType.UploadProgress:
											this.progress = Math.round(event.loaded / event.total * 100);
											if(this.progress>= 100){								 
											  //	this.showUploadButton =false;			
												//	const thumbnailPath = signedURLRes.split('?')[0];					
												//	this.courseUploadForm.controls['filetype'].setValue(thumbnailPath);
												//	this.courseDetailForm.controls['thumbnail'].setValue(thumbnailPath);							 
								 			}
											console.log(`Uploaded! ${this.progress}%`);
											break;
											case HttpEventType.Response:						
											this.uploadedData = event.body;
											this.showUploadButton =false;	
											this.courseUploadForm.controls['filename'].setValue(this.uploadedData.filename);
										}										
								});
  }
  async submitEnroll(event){
      
			if(this.selectedMembers && this.selectedMembers.length > 0 ){
				this.showSpinner = true;
				let enrollData = { members: this.selectedMembers,
								   course:this.created_course_id
								 }
				let enrollResponse = await this.chapterService.enrollUserWithChapterCourse(enrollData); 
				if(enrollResponse && !enrollResponse.error)
				{
					this.showSpinner = false;
					this.dialogRef.close({ submitClicked: true });
				}
				else{
					this.showSpinner = false;
					this.toastr.error('Error on course creation.');					
				}
			}
  }
  selectedTabChange(event){
    console.log('selectedTabChange  ',event);
		this.selectedChapterIndex = event.index;
		if(this.chapterMembers){
			const chapters:any = this.selectedChapters.map(item=>item.id)
			this.members = this.chapterMembers[chapters[this.selectedChapterIndex]]
		}
  }
  selectedIndexChange(event){
    	console.log('selectedIndexChange  ',event);
  }
  memberSelectHandler(event){
    console.log('memberSelectHandler  ',event);
				const chapters:any = this.selectedChapters.map(item=>item.id)
				if(event.target.checked){
					this.selectedMembers.push({member:event.target.value,chapter:chapters[this.selectedChapterIndex]})
				}
				else{
					const found:any = this.selectedMembers.find(item => item.member == event.target.value );
					if(found){
					  this.selectedMembers.splice(this.selectedMembers.indexOf(found),1);
					}
				}
				console.log('this.selectedMembers  ',this.selectedMembers);
  }
  configForms(){
	/*	this.courseForm = this._formBuilder.group({
							
							trackmode: ['', Validators.required],
							chapters: ['', Validators.required],						
							avatar: [null]
						});*/
		this.courseUploadForm = this._formBuilder.group({						 
						 filename: [''],							 
						});	
		this.courseDetailForm = this._formBuilder.group({							 
							title: [''],
							description: [''],
							duration: [''],
							chapters: ['', Validators.required],
						});	
		this.enrolmentForm = this._formBuilder.group({						 
						 	members: ['', Validators.required]
						});	
	//	this.courseUploadForm.controls['trackmode'].setValue(this.trackedItem.value);		
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
					console.log('chapterStructure  ', this.chapterStructure);
         }
				 console.log('getChapters  ',response);
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
	async getMembersinChapters(){
		const chapters:any = this.selectedChapters.map(item=>item.id);		 
		this.chapterMembers  = await this.chapterService.getMembersinChapters({chapter:chapters});
	 	if(this.chapterMembers){
			this.members = this.chapterMembers[chapters[this.selectedChapterIndex]]
		}	
  	console.log('response   ',this.chapterMembers);
	}
  continue(event,form){
				console.log('form.valid  ',form.valid);
				console.log('stepperIndex  ',this.stepper.selectedIndex );
				if(form.valid){
					this.stepper.next();
				}
    }
    
	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}

}
