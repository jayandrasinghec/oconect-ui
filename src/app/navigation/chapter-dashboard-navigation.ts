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
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/chapterlist',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'members',
                title    : 'Members',
                translate: 'NAV.MEMBERS.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/memberlist',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'training',
                title    : 'Training',
                translate: 'NAV.TRAINING.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/training',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'activity',
                title    : 'Activity',
                translate: 'NAV.ACTIVITY.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/activity',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'event',
                title    : 'Event',
                translate: 'NAV.EVENT.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/event',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'projects',
                title    : 'Projects',
                translate: 'NAV.PROJECTS.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/projects',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
            {
                id       : 'calender',
                title    : 'Calender',
                translate: 'NAV.CALENDER.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/calender',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
             {
                id       : 'gradebook',
                title    : 'Gradebook',
                translate: 'NAV.GRADEBBOK.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/gradebook',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
             {
                id       : 'knowledgecenter',
                title    : 'Knowledge Center',
                translate: 'NAV.KNOWLEDGECENTER.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/knowledgecenter',
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
                url      : '/dashboard/chapter/%chapterID%/%chapterName%/filemanagement',
            }
        ]
    }
];
