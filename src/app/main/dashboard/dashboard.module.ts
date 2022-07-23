import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { OrganisationComponent } from './organisation/organisation.component';
import { RouterModule } from '@angular/router';
import {OrganisationModule} from './organisation/organisation.module';
import {ChapterModule} from './chapter/chapter.module';
import {MemberModule} from './member/member.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatGridListModule} from '@angular/material/grid-list'
import { NgxUploaderModule } from 'ngx-uploader';
import {MatStepperModule} from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ContentModule } from 'app/layout/components/content/content.module';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from 'app/layout/components/toolbar/toolbar.module';
import { AddchapterComponent } from './shared/addchapter/addchapter.component';
//import { ChapterComponent } from './chapter/chapter.component';
 

/*------SERVICES------------*/
import {ChapterService} from '../../services/chapter.service';
import {CourseService} from '../../services/course.service';
import{VideoProcessingService} from '../../services/videoprocessing.service';

import { InviteMemberComponent } from './shared/invitemember/invitemember.component';
import { AddmemberComponent } from './shared/addmember/addmember.component';
import { DashboardComponent } from './dashboard.component';
import { MasterAdminComponent } from './master-admin/master-admin.component';
import { AddcourseComponent } from './shared/addcourse/addcourse.component';
import { AddVideoCourseComponent } from './shared/add-video-course/add-video-course.component';
import { OtherCoursesComponent } from 'app/main/dashboard/member/components/training/other-courses/other-courses.component';
import { VideoCoursesComponent } from 'app/main/dashboard/member/components/training/video-courses/video-courses.component';
import { CoursesComponent } from 'app/main/dashboard/member/components/training/courses/courses.component';
import { GradebookComponent } from 'app/main/dashboard/member/components/gradebook/gradebook.component';
import { CalenderComponent } from 'app/main/dashboard/member/components/calender/calender.component';
import { ProjectsComponent } from 'app/main/dashboard/member/components/projects/projects.component';
import { EventComponent } from 'app/main/dashboard/member/components/event/event.component';
import { ActivityComponent } from 'app/main/dashboard/member/components/activity/activity.component';
import { TrainingComponent } from 'app/main/dashboard/member/components/training/training.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainmenuComponent } from 'app/main/dashboard/member/components/mainmenu/mainmenu.component';
import { CourseWindowComponent } from './shared/course-window/course-window.component';
import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxDropDownButtonModule }    from 'jqwidgets-ng/jqxdropdownbutton';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { ArticleWindowComponent } from './shared/article-window/article-window.component';
import { AddOtherCourseComponent } from './shared/add-other-course/add-other-course.component';
import { FileManagementComponent } from './shared/file-management/file-management.component';
 


const routes = [
  {
    path     : 'organisation',
    loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule),
    component: DashboardComponent
  },
  {
    path     : 'chapter',
    loadChildren: () => import('./chapter/chapter.module').then(m => m.ChapterModule ),
    component: DashboardComponent
  },
  {
    path     : 'member',
    loadChildren: () => import('./member/member.module').then(m => m.MemberModule ),
    component: DashboardComponent
  },
  {
    path     : 'master-admin',
    component: MasterAdminComponent
  }
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
  //   }
];

@NgModule({
  declarations: [AddchapterComponent, 
    InviteMemberComponent, 
    AddmemberComponent, 
    DashboardComponent, 
    MasterAdminComponent, 
    AddcourseComponent, 
    AddVideoCourseComponent,
    MainmenuComponent,
    TrainingComponent, 
    ActivityComponent, 
    EventComponent, 
    ProjectsComponent, 
    CalenderComponent, 
    GradebookComponent,  
    CoursesComponent, 
    VideoCoursesComponent, 
    OtherCoursesComponent, CourseWindowComponent, ArticleWindowComponent, AddOtherCourseComponent, FileManagementComponent
  ],
  imports: [
    RouterModule.forChild(routes), 
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        FuseSidebarModule,
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
        MatDialogModule,
        MatGridListModule,
        MatSelectModule,
        MatCheckboxModule,
        OrganisationModule,
        ChapterModule,
        MemberModule,
        NgxUploaderModule,
        MatTableModule,
        MatToolbarModule,
        MatTabsModule,
        MatProgressBarModule,
        jqxTreeModule, jqxDropDownButtonModule, jqxExpanderModule,
        MatProgressSpinnerModule,
        MatStepperModule
   
  ],
  providers:[ChapterService,CourseService,VideoProcessingService],
  exports     : []
})
export class DashboardModule { }
