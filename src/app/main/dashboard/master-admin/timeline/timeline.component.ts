import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'profile-timeline',
    templateUrl  : './timeline.component.html',
    styleUrls    : ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AdminTimelineComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    constructor(){
    }
    ngOnInit(): void {
    }

    ngOnDestroy(): void{
    }
}
