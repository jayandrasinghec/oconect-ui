import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
//import { SampleModule } from 'app/main/sample/sample.module';
import {AuthModule} from 'app/main/auth/auth.module';
import {SetupModule} from 'app/main/setup/setup.module';

import { UtilsService } from './services/Utils.service';
import { ToastrModule } from 'ngx-toastr';
import { DragDropFileUploadDirective } from './core/directives/drag-drop-file-upload.directive';
const appRoutes: Routes = [
    {
        path      : '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
    path: 'login',
    loadChildren: () => import('./main/auth/auth.module').then(m => m.AuthModule),
    },
    {
    path: 'setup',
    loadChildren: () => import('./main/setup/setup.module').then(m => m.SetupModule),
    },
    {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    },
  /*  {
    path: 'member',
    loadChildren: () => import('./main/profile/profile.module').then(m => m.ProfileModule),
    }*/

];

@NgModule({
    declarations: [
        AppComponent,
        DragDropFileUploadDirective
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload'
          }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        //SampleModule,
        AuthModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        })
    ],
    providers:[UtilsService],
    bootstrap   : [
        AppComponent
    ],
    exports:[BrowserAnimationsModule]
})
export class AppModule
{
}
