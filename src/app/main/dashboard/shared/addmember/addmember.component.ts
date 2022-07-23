import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ChapterService } from 'app/services/chapter.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import AuthService from 'app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AddmemberComponent implements OnInit {

  addMemberForm:FormGroup;
  isMemberAdded: boolean = false;
  orgID:any;
  chapters:any; 
  chapter:any;
  selectedChapter:any;
  showSpinner:boolean  =false;

  constructor(private _formBuilder: FormBuilder,    
    public dialogRef: MatDialogRef<AddmemberComponent>,
     private avtivatedRoute : ActivatedRoute,
     private chapterService : ChapterService,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.orgID = data.organisation;
      this.chapters = data.chapters; 
      this.selectedChapter =   this.chapters[0]; 
      console.log('data.chapters  ',data.chapters);
     }

  ngOnInit(): void {
    this.addMemberForm = this._formBuilder.group({
      email   : ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      chapter : ['', Validators.required],
      mobile : ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      isCoordinator:[false],
   });
 this.addMemberForm.controls['chapter'].setValue(this.selectedChapter.id );  
  }

  async submit(event){
    if(this.addMemberForm.valid){
       console.log('this.addMemberForm.valid  ',this.addMemberForm.value);
       let memberData = {
         username : this.addMemberForm.value.email,
         email : this.addMemberForm.value.email,
         mobile : this.addMemberForm.value.mobile,
         chapter : this.addMemberForm.value.chapter,
         isCoordinator : this.addMemberForm.value.isCoordinator

       }
       this.showSpinner =true;
       const response:any = await this.chapterService.addMember(memberData);
       if(response){
         this.isMemberAdded = true;
         this.showSpinner =false;
         this.dialogRef.close({ submitClicked: true,response:response,type:'add' });
       }
       else if(response.error)
       {
        this.showSpinner =false;
          this.toastr.error(response.error.message);
       }
       console.log('sendInvitation   : ',response);
     }
 }

 
 updateCoOrdinator(event){
  this.addMemberForm.controls['isCoordinator'].setValue(event.checked);
   console.log('this.addMemberForm.value  ',this.addMemberForm.value);
}

}
