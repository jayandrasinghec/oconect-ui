import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import LocalStorageService from 'app/services/localstorage.service';
import { Subject } from 'rxjs/internal/Subject';
import { ProfileService } from 'app/services/profile.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
    selector     : 'profile',
    templateUrl  : './profile.component.html',
    styleUrls    : ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy
{
    about: any;
    members: any[];
    
        // Private
        private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     */

    profileImage:any = 'assets/images/avatars/profile.jpg';

    constructor(
        private _profileService: ProfileService
    )
    {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(){
        this._profileService.aboutOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(about => {
            console.log('about', about)
            this.about = about.user;
            this.members = about.chapterMembers
            this.profileImage = this.about.profile.photo && this.about.profile.photo.url ? this.about.profile.photo.url: "assets/images/avatars/profile.jpg";
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
