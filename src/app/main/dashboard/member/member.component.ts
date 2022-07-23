import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/member-dashboard-navigation';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class MemberComponent implements OnInit {
   navigation: any;
   fuseConfig: any;
   private _unsubscribeAll: Subject<any>;
  constructor(private _fuseNavigationService:FuseNavigationService, 
              private _fuseConfigService: FuseConfigService,) {
                 this._unsubscribeAll = new Subject();
                  this.navigation = navigation;   
               }

  ngOnInit(): void {
      this._fuseNavigationService.register('member', this.navigation);
      this._fuseNavigationService.setCurrentNavigation('member');

      this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
            this.fuseConfig = config;
            console.log('fuseConfig', this.fuseConfig);          
        });
  }

}
