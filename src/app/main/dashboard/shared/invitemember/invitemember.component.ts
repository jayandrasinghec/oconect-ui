import { Component, OnInit, Inject ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChapterService} from '../../../../services/chapter.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-invitemember',
  templateUrl: './invitemember.component.html',
  styleUrls: ['./invitemember.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class InviteMemberComponent implements OnInit {

  orgID:any;
  chapters:any; 
  chapter:any;
  inviteMemberForm: FormGroup;
  selectedChapter:any;
  isCoordinator:boolean = false;
  isInvitaionSend:boolean = false;
  showSpinner:boolean  =false;
  constructor(private _formBuilder: FormBuilder,
    private chapterService:ChapterService,
    public dialogRef: MatDialogRef<InviteMemberComponent>,
     private avtivatedRoute : ActivatedRoute,
     private toastr : ToastrService,
     @Inject(MAT_DIALOG_DATA) public data: any) {

      this.orgID = data.organisation;
      this.chapters = data.chapters; 
      this.selectedChapter =   this.chapters[0]; 
      console.log('data.chapters  ',data.chapters);
      }

  ngOnInit(): void {

     this.inviteMemberForm = this._formBuilder.group({
           isCoordinator:[false],
           email   : ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
           chapter: ['', Validators.required]
        });
      this.inviteMemberForm.controls['chapter'].setValue(this.selectedChapter.id );  
  }
  async submit(event){
     if(this.inviteMemberForm.valid){
        console.log('this.inviteMemberForm.valid  ',this.inviteMemberForm.value);
        this.showSpinner =true;
        const response:any = await this.chapterService.sendInvitation(this.inviteMemberForm.value);
        if(response && response.accepted){
          this.isInvitaionSend = true;
          this.showSpinner =false;
          this.dialogRef.close({ submitClicked: true,response:response,type:'invite' });
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
    this.inviteMemberForm.controls['isCoordinator'].setValue(event.checked);
     console.log('this.inviteMemberForm.value  ',this.inviteMemberForm.value);
  }

}
