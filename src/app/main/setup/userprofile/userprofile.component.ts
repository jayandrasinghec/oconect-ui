import { Component, OnInit,ViewEncapsulation,ViewChild, ElementRef, NgZone  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UploadComponent} from '../../shared/upload/upload.component';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import {SignupService} from '../../../services/signup.service';
import   LocalStorageService from '../../../services/localstorage.service';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'app/core/model/user-profile.model';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations   : fuseAnimations
})
export class UserprofileComponent implements OnInit {
 @ViewChild('search')
  public searchElementRef: ElementRef;

 
  genders:any[]=[{label:'Male',value:'M'},{label:'Female',value:'F'},{label:'Others',value:'O'}];
  selectedGender:any;
  showSpinner:boolean = false;
  /* --*/
  isLinear = false;
   profileForm: FormGroup;
  addressForm: FormGroup;  
  areasForm:FormGroup; 
  imgURL: any = 'assets/images/avatars/profile.jpg';
  /*----*/

  /*-----Google map Settings-------*/
  latitude: number;
  longitude: number;
  zoom:number;
  private geoCoder;
  address: string;
  /*-----------------*/
  areaofInterest:any[]=[];
   public maxDate = new Date();
   userProfileModel : UserProfile;

  constructor(  private _formBuilder: FormBuilder, public dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private signupService:SignupService,
    private activatedRoute:ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
     this.profileForm = this._formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            gender: ['', Validators.required],
            dob: ['', Validators.required],
            photo: [''],           
            about_me: ['', Validators.required] ,
            user:['',Validators.required]
        });
        this.addressForm = this._formBuilder.group({
           latitude: ['', Validators.required],
           longitude: ['', Validators.required]
        });
        this.areasForm = this._formBuilder.group({
          areas: ['']
        });

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log(place)
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });     

  }
  async submit(event){
    console.log('this.profileForm ',this.profileForm.value);
    console.log('this.addressForm ',this.addressForm.value);
    console.log('this.areasForm ',this.areasForm.value);
    const  userID:any = this.activatedRoute.snapshot.paramMap.get('userId');
    this.profileForm.controls['user'].setValue(userID);
    console.log(this.profileForm.valid);
    if(this.profileForm.valid){
      this.userProfileModel = new UserProfile();
      this.userProfileModel.firstname = this.profileForm.value.firstname;
      this.userProfileModel.lastname = this.profileForm.value.lastname;
      this.userProfileModel.gender = this.profileForm.value.gender.label;
      this.userProfileModel.dob = this.profileForm.value.dob;
      this.userProfileModel.about_me = this.profileForm.value.about_me;
      this.userProfileModel.photo = this.profileForm.value.photo == ""? undefined: this.profileForm.value.photo;
      this.userProfileModel.location = JSON.stringify({latitude: this.latitude,longitude: this.longitude });
      this.userProfileModel.address = this.address;
      this.userProfileModel.area_of_interest = JSON.stringify(this.areaofInterest);
      this.userProfileModel.user = this.profileForm.value.user;

      const response:any = await this.signupService.setupProfile(this.userProfileModel, userID);
      console.log('submit userprofile  : ',response);
      if(response && !response.error)
      {
        this.router.navigateByUrl('dashboard/member')
      }
    }


  }

  ongenderChange(event){
    console.log('Event  ',event);
    this.profileForm.controls['gender'].setValue(event.value);
  }
  dateChangeEvent(event){
    const dob: string = this.convert(event.value)
    console.log('Event  ',this.convert(event.value));
    this.profileForm.controls['dob'].setValue(dob);
    console.log(this.profileForm.value.dob)
  }
  CheckBoxClickHandler(event,type){
     this.areaofInterest.push(type);
  }
 
  openPopup(event){
   const dialogRef = this.dialog.open(UploadComponent, {
      width: '550px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
       if(result && result.logoPath){
       // this.havelLogo = true;
       const reader = new FileReader();
        reader.onload = (e) => {
          this.imgURL =  e.target.result;
        }
        reader.readAsDataURL(result.file);
        this.profileForm.controls['photo'].setValue(result.logoPath);
       }      
    });
  }


  /*---------------------------------*/
   private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 15;
        });
      }
    }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  convert(date) {
    console.log('convert date', date);
    const mnth = ("0" + (date._i.month + 1)).slice(-2);
    const day = ("0" + date._i.date).slice(-2);
    return [ day,mnth,date._i.year ].join("/");
  }

}
