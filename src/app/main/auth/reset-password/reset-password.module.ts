import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';
import { ResetPasswordComponent } from 'app/main/auth/reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';



const routes = [
    {
        path     : '',
        component: ResetPasswordComponent
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,

        FuseSharedModule
    ]
})
export class ResetPasswordModule
{
}
