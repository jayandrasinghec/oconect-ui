import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UploadComponent} from '../../shared/upload/upload.component';
import {OrganisationService} from '../../../services/organisation.service';
import LocalStorageService from '../../../services/localstorage.service';
@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
  /*encapsulation: ViewEncapsulation.None,*/
  animations   : fuseAnimations
})
export class OrganisationComponent implements OnInit {

  orgForm: FormGroup;
  imgURL: any
  showSpinner:boolean = false;
  constructor(  private _formBuilder: FormBuilder,
                private router: Router,
                public dialog: MatDialog,
                private orgService: OrganisationService) { }

   ngOnInit(): void
    {
        this.orgForm = this._formBuilder.group({
            name: ['', Validators.required],
            logo: [''],
            user: ['']
        });
    }
    openDialog(event): void {
    const dialogRef = this.dialog.open(UploadComponent, {
      width: '550px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);

       if(result && result.logoPath){

        this.imgURL = result.logoPath;
        this.orgForm.controls['logo'].setValue(result.logoPath);
       }      
    });
  }
  async submit(event){
    console.log('this.orgForm.value  ',this.orgForm.value);
    if(this.orgForm.valid){
      this.showSpinner = true;

      const loggedInUser: any = JSON.parse(LocalStorageService.getInstance().getItem("OConnect-UserInfo"));
      this.orgForm.controls['user'].setValue(loggedInUser._id);
      const response:any = await this.orgService.createOrganisation(this.orgForm.value);
      console.log('response  ',response);
      if(response && response._id){
         this.showSpinner = false;
         LocalStorageService.getInstance().saveData('OConnect-Organisation',JSON.stringify(response));
         this.router.navigateByUrl(`dashboard/organisation`);
      }
    }

  }


}
