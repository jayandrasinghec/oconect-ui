import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SignupService } from '../../../../services/signup.service';

@Component({
  selector: 'signup-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent implements OnInit {

  debouncer: any;
  @Input()
  userData: any;
  userForm: FormGroup;
  isChecked: boolean;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";  

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'userNameNotAvailable', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
    }
  isValidFormSubmitted = false;
  constructor(private _formBuilder: FormBuilder, private signupService: SignupService) { 
  }

  ngOnInit(): void {
    console.log(this.userData)
    this.userForm = this._formBuilder.group({
        username   : ['', Validators.compose([Validators.maxLength(25), Validators.minLength(5), Validators.pattern('[a-zA-Z]*'), Validators.required]),
        this.checkUsername.bind(this)],
        email: ['', Validators.required],
        chaptername: [ '', Validators.required],
        mobile: ['', Validators.required],
        password   : ['', Validators.compose([Validators.minLength(5),Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
        confirmpassword  : ['', Validators.compose([Validators.required]), 
        this.checkPasswords.bind(this)],
        terms: ['', Validators.required]
    });

    
    this.userForm.get('email').setValue(this.userData.email);
    this.userForm.get('chaptername').setValue(this.userData.chapter.name);
  }

  onCheckboxChange(eve) {
    
  }
  checkUsername(control: FormControl): any {
    clearTimeout(this.debouncer);
    return new Promise(resolve => {
      this.debouncer = setTimeout(async () => {
        const usernameAvailable = await this.signupService.validateUsername(control.value);
        console.log(usernameAvailable)
        if(!usernameAvailable){
          return resolve(null);
        }
        resolve({ "userNameNotAvailable" : {value: control.value}} )
        
      }, 1000);      

    });
  }

  checkPasswords(control: FormControl) { // here we have the 'passwords' group
    console.log(this.userForm.get('password').value)
    clearTimeout(this.debouncer);
    return new Promise(resolve => {
      this.debouncer = setTimeout(async () => {
        let pass = this.userForm.get('password').value;
        if(pass === control.value){
          return resolve(null);
        }
        resolve({ areEqual: true } )
        
      }, 1000);      

    });
  }

}
