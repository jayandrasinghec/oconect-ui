import { Component, OnInit ,Inject , ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {SignupService} from '../../../../services/signup.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-invitation-accept',
  templateUrl: './invitation-accept.component.html',
  styleUrls: ['./invitation-accept.component.scss'],
   encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class InvitationAcceptComponent implements OnInit {

   invitationForm: FormGroup;
   invitationID:any;
   showSpinner:boolean = false;
  constructor(private _formBuilder: FormBuilder,
               private signupService:SignupService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private router:Router,
               public dialogRef: MatDialogRef<InvitationAcceptComponent>,
              ) { 
                this.invitationID = data.invitationId;
                console.log('this.invitationID   ',this.invitationID );

              }

  ngOnInit(): void {
     this.invitationForm = this._formBuilder.group({
           accept:['', Validators.required]              
      });
  }
  accept(event){

  }
  async submit(event){
    this.showSpinner = true;
    const response:any = await this.signupService.acceptInvite(this.invitationID);
    if(response && response.status == 'accepted'){
      this.showSpinner = false;
      this.dialogRef.close({ submitClicked: true, value : response});
     // this.router.navigateByUrl(`signup`);
    }
    console.log('respone : ',response);
  }

}
