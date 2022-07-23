import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'training',
                title    : 'Training',
                translate: 'NAV.TRAINING.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard/member/training',
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
                url      : '/dashboard/member/activity',
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
                url      : '/dashboard/member/event',
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
                url      : '/dashboard/member/projects',
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
                url      : '/dashboard/member/calender',
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
                url      : '/dashboard/member/gradebook',
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
                url      : '/dashboard/member/knowledgecenter',
               /* badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }*/
            },
        ]
    }
];
