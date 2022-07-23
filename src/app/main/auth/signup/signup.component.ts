import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SignupService } from '../../../services/signup.service';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations   : fuseAnimations

})
export class SignupComponent implements OnInit {

  isLinear = false;
  @ViewChild('stepper') stepper: MatStepper;
  userData: any
  constructor(private _formBuilder: FormBuilder, private signUpService: SignupService, private router: Router) {

  }

  async ngOnInit() {
    console.log(this.stepper)
    this.checkToken();
  }

  async checkToken(){
    this.userData = await this.signUpService.getUserDetailsByToken('ashish');
    this.userData.termsAccepted = false;
    console.log(this.userData);
 }

}
