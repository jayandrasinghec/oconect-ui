import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import AuthService from 'app/services/auth.service';
import LocalStorageService from 'app/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { AccountSuccessComponent } from 'app/main/auth/register/account-success/account-success.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    resetPasswordForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private toastr : ToastrService,
        private dialog : MatDialog
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
        this.resetPasswordForm = this._formBuilder.group({
            // name           : ['', Validators.required],
            // email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
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

    async resetPasswordClickHandler(event){
        let userInfo : any = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
        userInfo = JSON.parse(userInfo);

        const data = {id : userInfo._id, password : this.resetPasswordForm.value.password, resetpassword : false}
        const response = await AuthService.getInstance().resetPassword(data);        
        console.log('resetPasswordClickHandler', response);
        if(response && response._id){
            this.showAccountSuccessPopup();
        }
        else if (response.error){
            this.toastr.error(response.error.message);
        }
    }

    showAccountSuccessPopup(){
         const dialogRef = this.dialog.open(AccountSuccessComponent, {
            disableClose: true,
            width: '550px',
            data: {
                message : 'PASSWORD RESET SUCCESSFULLY'
            }
            });
            dialogRef.afterClosed().subscribe(async result => {
            console.log('The dialog was closed',result);
            if(result && result.submitClicked){}      
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
