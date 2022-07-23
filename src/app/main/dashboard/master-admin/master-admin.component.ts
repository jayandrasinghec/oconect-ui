import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service'; 
import { fuseAnimations } from '@fuse/animations';

import { navigation } from 'app/navigation/org-dashboard-navigation';
import { Router } from '@angular/router';
 
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
  selector: 'app-master-admin',
  templateUrl: './master-admin.component.html',
  styleUrls: ['./master-admin.component.scss']
})
export class MasterAdminComponent implements OnInit {
  fuseConfig: any;
  navigation: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor( private _fuseConfigService: FuseConfigService,
               private _fuseNavigationService:FuseNavigationService,
              private router : Router) {
    
    this.navigation = navigation;
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
      this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
          this.fuseConfig = config;
          console.log('fuseConfig', this.fuseConfig);
      });   
        
  }

}
