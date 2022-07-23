import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { SignupService } from 'app/services/signup.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {InvitationAcceptComponent } from './invitation-accept/invitation-accept.component';
import { AccountSuccessComponent } from './account-success/account-success.component';
import { ChapterService } from 'app/services/chapter.service';
import { Signup } from 'app/core/model/signup.model';
import AuthService from 'app/services/auth.service';
import { ChaptersTreeGridComponent } from './chapters-tree-grid/chapters-tree-grid.component';
import { OrganisationService } from '../../../services/organisation.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None, 
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;
    public debouncer : any;
    public acceptedResponse : any;
    public showRegister:boolean = true;
    public showSuccess:boolean = false;
    private accepted : number = 1;
    public chapter : any;
    private signupModel : Signup
    public isTermsChecked : boolean = false;
    public selectedChapter : any;
    public chapters : any[] = [];
    public showSpinner:boolean = false;
    public isInvited: boolean = false;
    public signupType : boolean = false;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private signupService : SignupService,
         private avtivatedRoute : ActivatedRoute,
         public dialog: MatDialog,
          private router:Router,
          private chapterService : ChapterService,
          private organizationService : OrganisationService,
          private toastr : ToastrService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };


        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.signupType = this.avtivatedRoute.snapshot.paramMap.get('type') ? false : true;
        this.isTermsChecked = false;
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            mobile           : ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            iagree         :['', Validators.required],
            fullname        : ['', this.signupType ? Validators.required : null],
           // email : [],
            chapter : [],
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.registerForm.get('passwordConfirm').updateValueAndValidity();
        });

        /* IF url has type and invitaionid shoe the popup*/
        this.avtivatedRoute.params.subscribe( async(params:any) =>  {
            console.log('Params changes ',params);
            this.isInvited = params && params.type &&  params.invitationId;
             if(this.isInvited){
                 // check for user already accepted the invite if yes than navigate to the signup page else open a popup
                let memberInvite = await this.signupService.getMemberInviteByIdAndStatus(params.invitationId, this.accepted);
                if(memberInvite && memberInvite.length > 0){
                    this.acceptedResponse = memberInvite[0];
                    this.registerForm.controls['email'].setValue(this.acceptedResponse.email);
                    let chapterObj = await this.chapterService.getChapterById(this.acceptedResponse.chapter);
                    if(chapterObj && !chapterObj.error){
                        this.chapter = chapterObj;  
                        this.registerForm.controls['chapter'].setValue(this.chapter.name);   
                         this.chapters = [{name: chapterObj.name ,id: chapterObj._id  }];
                         this.selectedChapter = this.chapters[0];                                   
                        }
                        //this.router.navigateByUrl(`signup`);                  
                            
                    }
                    else
                    {
                        this.showInvitationAccept(params.invitationId); 
                    }            
                
             } else {
                 console.log("Self Signup");
                 const organization : any = await this.organizationService.getOrganisation();
                 const chapters = await this.chapterService.getChapters(organization._id);
                 if(!chapters.error) {
                    this.chapters = chapters.body;
                 }
                 console.log(organization, this.chapters);
             }
        });      
        


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    checkUsername(): any {
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
          this.debouncer = setTimeout(async () => {
            const usernameAvailable = await this.signupService.validateUsername(this.registerForm.value.name);
            console.log(usernameAvailable)
            if(!usernameAvailable){
              return resolve(null);
            }
            resolve({ "userNameNotAvailable" : {value: this.registerForm.value.name}} )
            
          }, 1000);      
    
        });
      }
      
      showInvitationAccept(invitationId:any){
            this.showRegister = false;
             const dialogRef = this.dialog.open(InvitationAcceptComponent, {
                 disableClose: true,
                width: '550px',
                data: {invitationId:invitationId }
                });
                dialogRef.afterClosed().subscribe(async result => {
                console.log('The dialog was closed',result);
                if(result && result.submitClicked){
                    this.showRegister = true;
                    this.acceptedResponse = result.value;
                    const chapterObj = await this.chapterService.getChapterById(this.acceptedResponse.chapter);
                    if(chapterObj && !chapterObj.error){
                        this.chapter = chapterObj;       
                        this.registerForm.controls['chapter'].setValue(this.chapter.name); 
                         this.chapters = [{name: chapterObj.name ,id: chapterObj._id  }];
                         this.selectedChapter = this.chapters[0];                                   
                    }
                    this.registerForm.controls['email'].setValue(this.acceptedResponse.email);                    
                     //this.router.navigateByUrl(`signup`);
                }      
             });
      }

      termsCheckBoxClickHandler(event){
          this.isTermsChecked = event.checked;
          this.registerForm.controls['iagree'].setValue(event.checked); 
          console.log('registerForm   ',this.registerForm.value);

      }

      async createAccountClickHandler(event){
            this.showSpinner = true;
            this.signupModel = new Signup();
            this.signupModel.email = this.registerForm.value.email;
            this.signupModel.chapter = this.isInvited? this.chapter._id : this.selectedChapter._id;
            if(this.isInvited) {
                this.signupModel.memberInvite = this.acceptedResponse._id;
            }
            this.signupModel.username = this.registerForm.value.name;
            this.signupModel.password = this.registerForm.value.password;
            this.signupModel.mobile = this.registerForm.value.mobile;
            if(this.signupType){
                this.signupModel.full_name = this.registerForm.value.fullname;
            }
            console.log('createAccountClickHandler', this.signupModel);
            
            const response = await AuthService.getInstance().signup(this.signupModel, this.signupType);
            if(response && response._id){
                this.showSpinner = false;
                this.showSuccess =  true;
                this.showRegister = false;
                this.showAccountSuccessPopup();
            }
            else if (response.error){
                this.showSpinner = false;
                this.toastr.error(response.error.message);
            }
            console.log('createAccountClickHandler', response)
            //if response have no errors than navigate to userprofile
      }
     showAccountSuccessPopup(){
            this.showRegister = false;
             const dialogRef = this.dialog.open(AccountSuccessComponent, {
                disableClose: true,
                width: '550px',
                data: {}
                });
                dialogRef.afterClosed().subscribe(async result => {
                console.log('The dialog was closed',result);
                if(result && result.submitClicked){}      
             });
      }

      openDialog(event): void {
        const dialogRef = this.dialog.open(ChaptersTreeGridComponent, {
          width: '550px',
          data: { chapters: this.chapters}
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed',result); 
          this.selectedChapter = result.selectedChapter?result.selectedChapter: this.selectedChapter;

        });
      }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
