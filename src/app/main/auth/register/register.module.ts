import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { FuseSharedModule } from '@fuse/shared.module';
import { RegisterComponent } from 'app/main/auth/register/register.component';
import { InvitationAcceptComponent } from './invitation-accept/invitation-accept.component';
import { ChapterService } from 'app/services/chapter.service';
import { AccountSuccessComponent } from './account-success/account-success.component';
import { ChaptersTreeGridComponent } from './chapters-tree-grid/chapters-tree-grid.component';



const routes = [
    {
        path     : '',
        component: RegisterComponent
    },
    {
        path:':type/:invitationId',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent,
        InvitationAcceptComponent,
        AccountSuccessComponent,
        ChaptersTreeGridComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        FuseSharedModule,
        MatSelectModule
    ],
    providers : [
        ChapterService
    ]
})
export class RegisterModule
{
}
