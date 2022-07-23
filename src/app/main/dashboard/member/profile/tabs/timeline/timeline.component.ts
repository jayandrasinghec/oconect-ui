import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from 'app/services/profile.service';

@Component({
    selector     : 'profile-timeline',
    templateUrl  : './timeline.component.html',
    styleUrls    : ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileTimelineComponent implements OnInit, OnDestroy, AfterViewInit
{
    timeline: any;
    posts : any[];
    message:any;
    @Input() userInfo : any;

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
        // this._profileService.timelineOnChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(timeline => {
        //         this.timeline = timeline;
        //     });
        this.posts = new Array();
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

    ngAfterViewInit(){
        console.log('ngAfterViewInit', this.userInfo)
    }

    postClickChandler(event){

        let post : any = {};
        if(this.message){
            post.message = this.message;
            this.posts.push(post);
            this.message = '';
        }
    }
}
