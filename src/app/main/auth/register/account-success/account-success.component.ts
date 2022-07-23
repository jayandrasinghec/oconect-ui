import { Component, OnInit , ViewEncapsulation, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-account-success',
  templateUrl: './account-success.component.html',
  styleUrls: ['./account-success.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AccountSuccessComponent implements OnInit {

  message : any = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.message = data.message ? data.message : 'YOUR ACCOUNT HAS BEEN SUCCESSFULLY CREATED';
   }

  ngOnInit(): void {
  }

}
