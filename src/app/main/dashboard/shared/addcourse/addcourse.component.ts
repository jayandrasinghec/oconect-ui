import { Component, OnInit, Inject ,ViewEncapsulation,EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {UtilsService } from '../../../../services/Utils.service';
import {UploadService} from '../../../../services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { DragdropService } from 'app/services/dragdrop.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import LocalStorageService from 'app/services/localstorage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree/jqwidgets-ng-jqxtree';
import { jqxDropDownButtonComponent } from 'jqwidgets-ng/jqxdropdownbutton/jqwidgets-ng-jqxdropdownbutton';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
  styleUrls: ['./addcourse.component.scss', '../../../../../../node_modules/jqwidgets-ng/jqwidgets/styles/jqx.base.css',],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class AddcourseComponent implements OnInit, AfterViewInit {
   
    trackmodes:any[]=[{label:'CMI5/XAPI',value:'cmi5/xapi'}, {label:'None',value:'none'}];
    showSpinner:boolean = false;
    chapters:any[];
	 selectedChapter:any;
	 uploadedData:any;

   /*------------------------*/
    options: UploaderOptions;
    formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;
	fileArr = [];
    imgArr = [];
	fileObj = [];
	msg: string;
	progress: number = 0;
	trackedItem : any ;
	chapterStructure:any[];
	userInfo :any;
	selectedChapters:any[];
	@ViewChild('myTree', { static: false }) myTree: any;
	@ViewChild('myDropDownButton', { static: false }) myDropDownButton: jqxDropDownButtonComponent;
	@ViewChild('stepper', { static: false }) stepper:any;
   /*------------------------*/
	showSubmitButton:boolean =false;
	showUploadButton:boolean =false;
	uploadStatus:any = 'upload';

	/*------------------------------------*/
	dropFile:any;
	color: ThemePalette = 'primary';
    mode: ProgressSpinnerMode = 'determinate';
    value = 50;


	/*-------------------------------*/
	courseForm: FormGroup;
	courseUploadForm:FormGroup;
	courseDetailForm:FormGroup;
	enrolmentForm:FormGroup;
	chapterMembers:any[];
	members:any[];
	selectedMembers:any[]=[];
	selectedChapterIndex:any=0;
	created_course_id:any;
	 
	 

   constructor( private _formBuilder: FormBuilder,
    private uploadService:UploadService,
		public dialogRef: MatDialogRef<AddcourseComponent>,
		private toastr : ToastrService,
		public dragdropService: DragdropService,
		private chapterService : ChapterService,
		private sanitizer : DomSanitizer,
     @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.chapters = data.chapters;
				this.selectedChapter =  this.chapters[0];
				this.trackedItem = this.trackmodes[0];
				this.selectedChapters = new Array();
     }

  ngOnInit(): void {
				this.docUploaded = new EventEmitter();
				this.options = { concurrency: 1, maxUploads: 1 , allowedContentTypes: ["application/x-zip-compressed"]  };
				this.files = [];  
				this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
				this.humanizeBytes = humanizeBytes;
				this.configForms();   

				this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
				this.userInfo = JSON.parse(this.userInfo);
				const isAdmin:boolean  = this.userInfo.roles.filter(i => i.machine_name == 'master_admin').length > 0;
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
	configForms(){
		this.courseForm = this._formBuilder.group({
							
							trackmode: ['', Validators.required],
							chapters: ['', Validators.required],						
							avatar: [null]
						});
		this.courseUploadForm = this._formBuilder.group({							 
							trackmode: ['', Validators.required],						 
							filename: ['', Validators.required],							 
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
		this.courseUploadForm.controls['trackmode'].setValue(this.trackedItem.value);		
	}
	trackModeChange(event){		
		this.courseUploadForm.controls['trackmode'].setValue(event.value.value);
		console.log('event   ',event,this.courseUploadForm.controls['trackmode'].value);
	}
	ngAfterViewInit(): void {
	//	this.myDropDownButton.setContent('<div style="position: relative; margin-left: 3px; margin-top: 4px;">Select</div>');
	}
onUploadOutput(output: UploadOutput): void {
		switch (output.type) {
		  case 'allAddedToQueue':
         break;
		  case 'addedToQueue':
		 	if (typeof output.file !== 'undefined' ) {
			  this.files[0] = output.file;
			  this.dropFile = this.files[0];			 
		      this.showUploadButton = true;
        	  console.log('this.files   ', this.files );
       }
	  this.showUploadButton = true;     
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
	// if (this.myTree && this.myDropDownButton) {
	// 		const item = this.myTree.getItem(event.args.element);
	// 		console.log('myTreeOnSelect', item, this.myTree)
	// 		const dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + item.label + '</div>';
	// 		this.myDropDownButton.setContent(dropDownContent);
	// 		this.selectedChapter = {id : item.id, name : item.label}
	// }
}
	fileDropped(e){
		console.log('File Dropped ',e);
		this.dropFile = e;
		this.uploadStatus ='zipicon';
		this.showUploadButton = true;

	}
	async uploadCourse(event) {
		if(this.dropFile){
	  this.uploadStatus ='progress';
	/*  const fileListAsArray = Array.from(this.dropFile.nativeFile);
    fileListAsArray.forEach((item, i) => {
      const file = (this.dropFile as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
    })
	console.log('this.fileArr ',this.fileArr);
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })
    console.log('this.fileObj  ',this.fileObj);*/
    // Set files form control
    this.courseForm.patchValue({
      avatar: this.dropFile.nativeFile
    })

    this.courseForm.get('avatar').updateValueAndValidity()
	console.log('this.courseForm.value.avatar  ',this.courseForm.value.avatar);
    // Upload to server
    this.dragdropService.addFiles(this.courseForm.value.avatar)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
						if(this.progress>= 100){
							this.showSubmitButton = true;
							this.showUploadButton =false;
						}
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:						
						this.uploadedData = event.body;
						this.courseUploadForm.controls['filename'].setValue(this.uploadedData.filename);	
            setTimeout(() => {
             // this.progress = 0;
              this.fileArr = [];
              this.fileObj = [];
              this.msg = "File uploaded successfully!"
            }, 3000);
        }
      })
		}
    
	}

	sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

 
  async startUpload(event) {
			console.log('this.files[]  ',this.files[0]);
		 	if (this.files && this.files.length > 0) {
			 const uploadResponse:any = await this.uploadService.uploadCourse(this.files[0]);
			 console.log('uploadResponse  ',uploadResponse);
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
	
		
	
	async submitCourse(event){
				if(this.courseDetailForm.valid){
					this.showSpinner = true;		
					let data : any = {
						filename : this.uploadedData.filename,
						chapters : this.selectedChapters.map(item=>item.id),
						user : this.userInfo._id
					}
					console.log('data  ',data);
					let response = await this.chapterService.createChapterCourse(data);	
					if(response && !response.error)
					 {
					   this.created_course_id = response[0].entity._id;
					   this.showSpinner = false;		
					   this.stepper.next(); 
					   this.getMembersinChapters();					 
					 }
				}
	}

  async submitEnroll(event){
		console.log('this.courseForm.valid  ',this.courseForm.valid);
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
	continue(event,form){
				console.log('form.valid  ',form.valid);
				console.log('stepperIndex  ',this.stepper.selectedIndex );
				if(form.valid){
					this.stepper.next();
				}
    }
	async getMembersinChapters(){
		const chapters:any = this.selectedChapters.map(item=>item.id);		 
		this.chapterMembers  = await this.chapterService.getMembersinChapters({chapter:chapters});
	 	if(this.chapterMembers){
			this.members = this.chapterMembers[chapters[this.selectedChapterIndex]]
		}
		

		console.log('response   ',this.chapterMembers);
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

  	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}

}
