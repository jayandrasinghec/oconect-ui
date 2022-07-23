import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import AuthService from '../../../services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'app/services/organisation.service';
import LocalStorageService from 'app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    showSpinner:boolean = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private orgService : OrganisationService,
        private toastr : ToastrService
    )
    {
        // Configure the layout
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            username   : ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    async submit(event){
       console.log('submit ',this.loginForm.value);
      if(this.loginForm.valid){
          this.showSpinner = true;
          const response:any = await  AuthService.getInstance().login(this.loginForm.value);
          console.log('response  ',response);
          if(response && response._id){
              //check for organization exist getOrganisation
            //   let organisationObj = LocalStorageService.getInstance().getJSONObject('OConnect-Organisation');
            //   if(organisationObj){
            //   }
            let masterAdmin = response.roles.filter(i => i.machine_name == 'master_admin');
            if(masterAdmin && masterAdmin.length > 0)
            {
                const response:any = await this.orgService.getOrganisation();
                console.log('response  ',response);
                this.showSpinner = false;
                if(response && !response.error){
                    LocalStorageService.getInstance().saveData('OConnect-Organisation',JSON.stringify(response));
                    this.router.navigateByUrl('dashboard/organisation/chapterlist');
                }
                else{
                    this.router.navigateByUrl('setup/organisation');
                }
            }
            else {
                if(response.resetpassword){
                    this.router.navigateByUrl(`resetpassword`);
                }
                else if(response.active == 0){                    
                    this.showSpinner = false;
                    this.toastr.error("Account not approved.");
                }
                else {
                    //navigate to user profile   
                    let isMember = response.roles.filter(i => i.machine_name == 'member').length > 0
                    if(isMember && response.profile){
                        let isCoordinator = response.members.length > 0 ? response.members[0].isCoordinator : false;
                        if(isCoordinator)
                        {
                            const orgResponse:any = await this.orgService.getOrganisation();
                            console.log('response  ',orgResponse);
                            this.showSpinner = false;
                            if(orgResponse && !orgResponse.error){
                                LocalStorageService.getInstance().saveData('OConnect-Organisation',JSON.stringify(orgResponse));
                                
                            }
                            let chapter = response.members[0].chapter;
                            this.router.navigateByUrl(`dashboard/chapter/${chapter._id}/${chapter.machine_name}/chapterlist`) 
                        }
                        else
                        {
                            this.router.navigateByUrl("dashboard/member");
                        }
                        
                    } else {
                        this.router.navigateByUrl(`setup/profile/${response._id}`);
                    }
                }
            }    
              
          }
          else if(response.error){
            this.showSpinner = false;
            this.toastr.error(response.error.message);
              console.log('login error', response.error.message);
          }
       }

    }

}
