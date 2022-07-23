import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes  } from '@angular/router';

import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatGridListModule} from '@angular/material/grid-list'

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ContentModule } from 'app/layout/components/content/content.module';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from 'app/layout/components/toolbar/toolbar.module';
 
 
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

import { ChapterlistComponent } from './chapterlist/chapterlist.component';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { ChapterComponent } from './chapter.component';
import {MemberListService} from '../../../services/memberlist.service';
import {ActiveUserListService} from '../../../services/active-userlist.service';
import {NonActiveUserListService } from '../../../services/nonactive-userlist.service';
import { InvitedlistComponent } from './memberlist/invitedlist/invitedlist.component';
import { ActivelistComponent } from './memberlist/activelist/activelist.component';
import { NonactivelistComponent } from './memberlist/nonactivelist/nonactivelist.component';
import { ActivityComponent } from 'app/main/dashboard/member/components/activity/activity.component';
import { CalenderComponent } from 'app/main/dashboard/member/components/calender/calender.component';
import { EventComponent } from 'app/main/dashboard/member/components/event/event.component';
import { GradebookComponent } from 'app/main/dashboard/member/components/gradebook/gradebook.component';
import { ProjectsComponent } from 'app/main/dashboard/member/components/projects/projects.component';
import { TrainingComponent } from 'app/main/dashboard/member/components/training/training.component';
import { OtherCoursesComponent } from 'app/main/dashboard/member/components/training/other-courses/other-courses.component';
import { VideoCoursesComponent } from 'app/main/dashboard/member/components/training/video-courses/video-courses.component';
import { CoursesComponent } from 'app/main/dashboard/member/components/training/courses/courses.component';
import { CourseLaunchComponent } from 'app/main/dashboard/member/components/training/course-launch/course-launch.component';
import { KnowledgeCenterComponent } from 'app/main/dashboard/member/components/knowledge-center/knowledge-center.component';
import { VideoLaunchComponent } from '../member/components/training/video-launch/video-launch.component';
import { FileManagementComponent } from 'app/main/dashboard/shared/file-management/file-management.component';
const routes: Routes = [
  {
    path: '',
    component: ChapterComponent,
    children: [
         /*-------------Components--------------------------*/                
                {
                path     : ':chapterID/:chapterName/chapterlist',
                component: ChapterlistComponent
                },
                {
                    path     : ':chapterID/:chapterName/memberlist',
                    component: MemberlistComponent,
                },
                // {
                //   path     : '',
                //   component: MainmenuComponent
                //   },
                  {
                      path     : ':chapterID/:chapterName/activity',
                      component: ActivityComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/calender',
                      component: CalenderComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/event',
                      component: EventComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/gradebook',
                      component: GradebookComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/projects',
                      component: ProjectsComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/training',
                      component: TrainingComponent,
                  }
                  ,
                  {
                      path     : ':chapterID/:chapterName/training/video',
                      component: VideoLaunchComponent,
                  }                  
                  ,
                  {
                      path     : ':chapterID/:chapterName/training/course/:courseId/:enrollId',
                      component: CourseLaunchComponent,
                  }
                  ,
                  {
                      path     : ':chapterID/:chapterName/knowledgecenter',
                      component: KnowledgeCenterComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/knowledgecenter/video',
                      component: VideoLaunchComponent,
                  },
                  {
                      path     : ':chapterID/:chapterName/filemanagement',
                      component: FileManagementComponent,
                  },                       
    ]
  } 
];

@NgModule({
  declarations: [
    ChapterComponent,  
    ChapterlistComponent, 
    MemberlistComponent, 
    InvitedlistComponent, 
    ActivelistComponent, 
    NonactivelistComponent,],
  imports: [
       CommonModule,
       RouterModule.forChild(routes) ,      
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
        MatCheckboxModule  ,
        MatRippleModule,
        MatMenuModule,
        MatTableModule,
        MatToolbarModule,
        MatTabsModule
  ],
  providers      : [
        MemberListService,
        ActiveUserListService,
        NonActiveUserListService
    ],
})
export class ChapterModule { }
