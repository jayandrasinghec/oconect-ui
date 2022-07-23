import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from 'app/services/profile.service';

@Component({
    selector     : 'profile-about',
    templateUrl  : './about.component.html',
    styleUrls    : ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy, AfterViewInit
{
    @Input()about: any;
    @Input() chapterMembers: any;
    membersProfilePics: any[];
    areaOfInterest : any = '';

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _profileService: ProfileService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // this._profileService.aboutOnChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(about => {
        //         console.log('about', about)
        //         this.about = about.user;
        //         this.areaOfInterest = this.about.profile.area_of_interest.replace(/"/g, '').replace('[', '').replace(']', '');
        //         this.chapterMembers = about.chapterMembers
        //         this.membersProfilePics = new Array();
        //         for(let member of this.chapterMembers)
        //         {
        //             let profileImage = member.profile.photo && member.profile.photo.url ? member.profile.photo.url: null;
        //             if(profileImage != null){
        //                 this.membersProfilePics.push(profileImage);
        //             }
                    
        //         }                
        //     });
    }

    ngAfterViewInit(){
        this.areaOfInterest = this.about.profile.area_of_interest.replace(/"/g, '').replace('[', '').replace(']', '');
        this.membersProfilePics = new Array();
        for(let member of this.chapterMembers)
        {
            let profileImage = member.profile.photo && member.profile.photo.url ? member.profile.photo.url: null;
            if(profileImage != null){
                this.membersProfilePics.push(profileImage);
            }
            
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
