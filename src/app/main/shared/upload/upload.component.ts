import {  Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {UtilsService } from '../../../services/Utils.service';
import {UploadService} from '../../../services/upload.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  options: UploaderOptions;
  formData: FormData;
	files: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;
	docUploaded: EventEmitter<any>;

  constructor(private utilsService: UtilsService,
							private uploadService:UploadService,
							public dialogRef: MatDialogRef<UploadComponent>,
							 @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.docUploaded = new EventEmitter();
	  this.options = { concurrency: 1, maxUploads: 1 , allowedContentTypes: ['image/jpeg' , 'image/tiff' , 'image/png' , 'image/gif' , 'image/bmp']  };
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
  async startUpload(event) {
			console.log('this.files[]  ',this.files[0]);
		 	if (this.files && this.files.length > 0) {
				const file:any = this.files[0];
			  console.log('file ',file);
	     	const filename = 'logo/'+ this.utilsService.searchReplaceSpace(this.utilsService.addTimeStatp(file.nativeFile.name));
				const objSend = this.getUploadObj(filename ,file.type );	
				console.log('objSend ', objSend);	 
		    const response = await this.uploadService.getSignedUrl(objSend);
		    console.log('response   ',response);
				const uploadResponse = await this.uploadService.uploadfileAWSS3(response,file.nativeFile,file.type );
		    console.log('uploadResponse   ',uploadResponse);
        if(uploadResponse == null){
					const logoPath = response.split('?')[0];
					this.closePopup(file.nativeFile,logoPath);
				}
	   	}
  }
	 closePopup(file:any,logoPath:any) {
    this.dialogRef.close({ closepopup: true ,file:file,logoPath:logoPath});
  }
	getUploadObj(path,mime){
		return {
			key:path ,
			mimeType:mime
		}
	}


}
