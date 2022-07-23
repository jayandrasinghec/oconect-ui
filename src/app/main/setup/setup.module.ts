import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

 
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AgmCoreModule } from '@agm/core';
 
 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {SharedModule} from '../shared/shared.module'; 
import { NgxUploaderModule } from 'ngx-uploader';
import {MatStepperModule} from '@angular/material/stepper';
import { OrganisationComponent } from './organisation/organisation.component';
import {UserprofileComponent} from './userprofile/userprofile.component';
import {OrganisationService} from  '../../services/organisation.service';
const routes = [
    {
        path     : '',
        redirectTo: 'organisation'
    },
    {
        path     : 'organisation',
        component: OrganisationComponent
    },{
        path: 'profile/:userId',
        component:UserprofileComponent
    }
];


@NgModule({
  declarations: [OrganisationComponent,UserprofileComponent],
  imports: [
     CommonModule,
     RouterModule.forChild(routes), 
     MatButtonModule,
     MatFormFieldModule,
     MatIconModule,
     MatInputModule,
     FuseSharedModule,
     MatDialogModule,
     SharedModule,
     NgxUploaderModule,
     MatDatepickerModule,
     MatSelectModule,
     MatStepperModule,
     MatCheckboxModule,
     AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA5WgRBdJ218nlv1DdmrmiJsSFNfRbNFIQ',
            libraries: ['places']
         })
  ],
  providers:[OrganisationService]
})

export class SetupModule { }
