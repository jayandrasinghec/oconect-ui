import { Component, OnInit, Inject ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
@Component({
  selector: 'app-addchapter',
  templateUrl: './addchapter.component.html',
  styleUrls: ['./addchapter.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class AddchapterComponent implements OnInit {
   
  chapterForm: FormGroup;
  orgID:any;
  chapterId:any; 
  chapter:any;
  showSpinner:boolean =false;
  constructor( private _formBuilder: FormBuilder,
    private chapterService:ChapterService,
    public dialogRef: MatDialogRef<AddchapterComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.orgID = data.organisation;
      this.chapterId = data.chapterId ; 
     }

  ngOnInit(): void {
  this.chapterForm = this._formBuilder.group({
            name: ['', Validators.required],
            //role: ['', Validators.required],
            //  region: ['', Validators.required],
        });

  }

  async submit(event){

   if(this.chapterForm.valid) {
        this.showSpinner  =true;
        const data:any = Object.assign(this.chapterForm.value, {organization: this.orgID , parent:this.chapterId});
        const response:any = await this.chapterService.createChapter(data);
        if(response && response._id){
           this.showSpinner  =false;
           this.dialogRef.close({ submitClicked: true, chapter :response });
        }
    }  
  }

}
