import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { FuseSharedModule } from '@fuse/shared.module';
import { ProfileService } from 'app/services/profile.service';
import { ProfileComponent } from 'app/main/dashboard/member/profile/profile.component';
import { ProfileTimelineComponent } from 'app/main/dashboard/member/profile/tabs/timeline/timeline.component';
import { ProfileAboutComponent } from 'app/main/dashboard/member/profile/tabs/about/about.component';
import { ProfilePhotosVideosComponent } from 'app/main/dashboard/member/profile/tabs/photos-videos/photos-videos.component';



const routes = [
    // {
    //     path     : '',
    //     redirectTo: 'dashboard'
    // },
    // {
    //     path     : 'profile',
    //     redirectTo: 'dashboard'
    // },
    {
        path     : '',
        component: ProfileComponent,
        resolve  : {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,

        FuseSharedModule
    ],
    providers   : [
        ProfileService
    ]
})
export class ProfileModule
{
}
