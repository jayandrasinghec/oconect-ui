import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../core/constants/constants';
import AuthService from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  CREATE_USER: any = 'register';
  VALIDATE_USERNAME: any = 'auth/validate-username';
  ACCEPT_INVITE:any = 'invite/'  
  CREATE_PROFILE:any = 'profile/'
  constructor(private http: HttpClient) {
  }

  async getUserDetailsByToken(token: string): Promise <any>{
    return {
      email : 'ashishbahetiem@gmail.com',
      chapter : {
        _id : "abc",
        name : "Chapter India"
      }
    }
  }
  validateUsername (username: string): boolean{
      console.log(username);
      return username === 'ashish';
      // return this.http.post(Constants.BASE_URL + Constants.BASE_ORG_URL + this.VALIDATE_USERNAME, {username}, AuthService.getInstance().headersWithToken).toPromise()
  }
  async regiseterUser(data): Promise <any> 
    {
        const response: any = await this.http.post( Constants.BASE_URL + Constants.BASE_ORG_URL + this.CREATE_USER, data, AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
    async acceptInvite(inviteID:any): Promise <any> 
    {
       console.log('inviteID   : ',inviteID);
        const response: any = await this.http.put( Constants.BASE_URL + Constants.BASE_MEMBER_URL + this.ACCEPT_INVITE + inviteID +'/1' , AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
   
    async getMemberInviteByIdAndStatus(inviteID:any, status:any): Promise <any> 
    {
      try{
       console.log('inviteID   : ',inviteID);
        const response: any = await this.http.get( Constants.BASE_URL + Constants.BASE_MEMBER_URL + this.ACCEPT_INVITE + inviteID +'/1' , AuthService.getInstance().headersWithToken).toPromise();
        return  response;
      }
      catch(e){
        return e;
      }
    }
    async setupProfile(data:any,userId:any): Promise <any> {
       try{
        console.log('data   : ',data);
     // api/v1/user/profile/5e549c9f85f2c707f82ff06d
        const response: any = await this.http.post( Constants.BASE_URL + Constants.BASE_USER_URL + this.CREATE_PROFILE+userId ,data , AuthService.getInstance().headersWithToken).toPromise();
        return  response;
      }
      catch(e){
        return e;
      }
    }

}
