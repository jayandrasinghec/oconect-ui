import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import   LocalStorageService from './localstorage.service';
import {Constants} from '../core/constants/constants';  

export default class AuthService {
  
    private static instance: AuthService;
    private _token: string;
    private _userId: any;
    private _userName:any;
    private tokenSubject = new Subject<any>();
    public readonly LOGIN_URL = 'auth/login';
    public readonly SIGNUP_URL = 'auth/signup';
    public readonly RESETPASSWORD_URL = 'auth/resetpassword';


    private constructor(private http:HttpClient) {
        
    }

    static getInstance(http:HttpClient = null) {
        if (!AuthService.instance && http) {
            AuthService.instance = new AuthService(http);           
        }
        return AuthService.instance;
    }

    async login(data:any) : Promise <any> {
     
        try{
          const response = await this.http.post( Constants.BASE_URL + this.LOGIN_URL, data).toPromise();
          console.log('login response ', response);
           if ( response["token"]){
              this.token = response["token"];                      
              this.tokenSubject.next({token:this.token});
              LocalStorageService.getInstance().saveData('OConnectToken', response["token"]);
              LocalStorageService.getInstance().saveData('OConnect-UserInfo', JSON.stringify(response));
           }
          return response;
        }
        catch(e){
            return e;
        }
    }
    
    async signup(signupData:any, selfSignup: boolean) : Promise <any> {
        
        try{
             const body = {data : signupData, selfsignup : selfSignup}
             const response = await this.http.post( Constants.BASE_URL + this.SIGNUP_URL, body).toPromise();
             console.log('login response ', response);
              if ( response["token"]){
                 this.token = response["token"];                      
                 this.tokenSubject.next({token:this.token});
                 LocalStorageService.getInstance().saveData('OConnectToken', response["token"]);
                 LocalStorageService.getInstance().saveData('OConnect-UserInfo', JSON.stringify(response));
              }
             return response;
            }
            catch(e){
                return e;
            }
    }

    
    async resetPassword(data:any) : Promise <any> {
        
        try{
             const body = data;
             const response = await this.http.put( Constants.BASE_URL + this.RESETPASSWORD_URL, body).toPromise();
             console.log('resetPassword ', response);
             return response;
            }
            catch(e){
                return e;
            }
    }
    
    onToken(): Observable<any>{
        return this.tokenSubject.asObservable();
    }
    get token() {
        return `Bearer ${this._token}`
    }
    set token(strToken: string){
        this._token = strToken;
    }

    get hasToken(){
        return LocalStorageService.getInstance().getItem('OConnectToken') ? true : false
    } 

    clearUserData(){
       
        this.token = null;
    }
  get headersWithToken() {

        const token = (this.token)?this.token:  `${LocalStorageService.getInstance().getItem('OConnectToken')}` ;
        return {headers : {'Content-Type':'application/json', 'Authorization': token}  }
    } 
}
