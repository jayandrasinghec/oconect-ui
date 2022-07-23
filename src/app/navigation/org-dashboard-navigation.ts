import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'chapters',
                title    : 'Chapters',
                translate: 'NAV.CHAPTERS.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/chapterlist',
            },
            {
                id       : 'members',
                title    : 'Members',
                translate: 'NAV.MEMBERS.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/memberlist',
            },
            {
                id       : 'training',
                title    : 'Training',
                translate: 'NAV.TRAINING.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/training',
            },
            {
                id       : 'activity',
                title    : 'Activity',
                translate: 'NAV.ACTIVITY.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/activity',
            },
            {
                id       : 'event',
                title    : 'Event',
                translate: 'NAV.EVENT.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/event',
            },
            {
                id       : 'projects',
                title    : 'Projects',
                translate: 'NAV.PROJECTS.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/projects',
            },
            {
                id       : 'calender',
                title    : 'Calender',
                translate: 'NAV.CALENDER.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/calender',
            },
             {
                id       : 'gradebook',
                title    : 'Gradebook',
                translate: 'NAV.GRADEBBOK.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/organisation/gradebook',
            },
            {
               id       : 'knowledgecenter',
               title    : 'Knowledge Center',
               translate: 'NAV.KNOWLEDGECENTER.TITLE',
               type     : 'item',
               icon     : 'dashboard',
               url      : '/dashboard/organisation/knowledgecenter',
              /* badge    : {
                   title    : '25',
                   translate: 'NAV.SAMPLE.BADGE',
                   bg       : '#F44336',
                   fg       : '#FFFFFF'
               }*/
           },
            {
               id       : 'filemanagement',
               title    : 'File Management',
               translate: 'NAV.FILEMANAGEMENT.TITLE',
               type     : 'item',
               icon     : 'dashboard',
               url      : '/dashboard/organisation/filemanagement',
           }
        ]
    }
];
