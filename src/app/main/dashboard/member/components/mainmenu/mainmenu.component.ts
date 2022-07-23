import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations

})
export class MainmenuComponent implements OnInit {

  widgets:any =  {
            scheme : {
                domain: ['#4867d2', '#5c84f1' ]
            },
            devices: [
                {
                    name  : 'Desktop',
                    value : 50,
                    change: -0.6
                },
                {
                    name  : 'Mobile',
                    value : 50,
                    change: 0.7
                },
                
            ]
        };
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  itemClickhandler(event,type){

    this.router.navigateByUrl(`dashboard/member/${type}`)

  }



}
