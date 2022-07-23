import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SignupService } from '../../../../services/signup.service';

@Component({
  selector: 'signup-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {
  debouncer: any;
  @Input()
  userData: any;
  userDetailsForm: FormGroup;

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Firstname is required' }
    ],
    'lastname': [
      { type: 'required', message: 'Firstname is required' }
    ]
    }
  constructor(private _formBuilder: FormBuilder, private signupService: SignupService) { 

   
  }

  ngOnInit(): void {
    console.log(this.userData)
    this.userDetailsForm = this._formBuilder.group({
        firstname: ['', Validators.required],
        lastname: [ '', Validators.required]
    });
  }

}
