import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes  } from '@angular/router';

import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatGridListModule} from '@angular/material/grid-list'
import {SharedModule} from '../../shared/shared.module'

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
 import { MatExpansionModule } from '@angular/material/expansion';


 
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



import { TrainingComponent } from './components/training/training.component';
import { ActivityComponent } from './components/activity/activity.component';
import { EventComponent } from './components/event/event.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CalenderComponent } from './components/calender/calender.component';
import { GradebookComponent } from './components/gradebook/gradebook.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import {MemberComponent} from './member.component';
import { CoursesComponent } from './components/training/courses/courses.component';
import { VideoCoursesComponent } from './components/training/video-courses/video-courses.component';
import { OtherCoursesComponent } from './components/training/other-courses/other-courses.component';
import { CourseLaunchComponent } from './components/training/course-launch/course-launch.component';
import { KnowledgeCenterComponent } from './components/knowledge-center/knowledge-center.component';
import { FaqComponent } from './components/knowledge-center/faq/faq.component';
import { VideoComponent } from './components/knowledge-center/video/video.component';
import { ArticlesComponent } from './components/knowledge-center/articles/articles.component';
import { AddFaqComponent } from './components/knowledge-center/faq/add-faq/add-faq.component';
import { VideoLaunchComponent } from './components/training/video-launch/video-launch.component';
import { AddArticleComponent } from './components/knowledge-center/articles/add-article/add-article.component'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
         /*-------------Components--------------------------*/                
                {
                    path     : '',
                    component: MainmenuComponent
                },
                {
                    path     : 'activity',
                    component: ActivityComponent,
                },
                {
                    path     : 'calender',
                    component: CalenderComponent,
                },
                {
                    path     : 'event',
                    component: EventComponent,
                },
                {
                    path     : 'gradebook',
                    component: GradebookComponent,
                },
                {
                    path     : 'projects',
                    component: ProjectsComponent,
                },
                {
                    path     : 'training',
                    component: TrainingComponent,
                }, 
                {
                    path     : 'training/video',
                    component: VideoLaunchComponent,
                },
                  {
                       path: 'profile',
                        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
                  },
                  {
                    path     : 'training/course/:courseId/:enrollId',
                    component: CourseLaunchComponent,

                  },
                  
                  {
                      path     : 'knowledgecenter',
                      component: KnowledgeCenterComponent,
                  },   
     ]
  } 
];



@NgModule({
  declarations: [MemberComponent, CourseLaunchComponent, KnowledgeCenterComponent, FaqComponent, VideoComponent, ArticlesComponent, AddFaqComponent, VideoLaunchComponent, AddArticleComponent ],
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
        MatTabsModule,
        MatProgressBarModule,
        NgxChartsModule,
        SharedModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
        
  ]
})
export class MemberModule { }
