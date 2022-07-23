import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {AuthComponent} from './auth.component'; 
import { LoginComponent } from 'app/main/auth/login/login.component';
import { RegisterComponent } from 'app/main/auth/register/register.component';

const routes = [
    {
        path     : '',
        component: LoginComponent
    },
     {
       path: 'signup',
      loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
    },
   {
      path: 'resetpassword',
      loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)
    }
];

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  imports: [
       CommonModule,
       RouterModule.forChild(routes), 
       MatButtonModule,
       MatCheckboxModule,
       MatFormFieldModule,
       MatIconModule,
       MatInputModule,
       FormsModule,
       ReactiveFormsModule,
        
  ]
})
export class AuthModule { }
