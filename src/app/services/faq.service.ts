import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Constants } from 'app/core/constants/constants';
import AuthService from './auth.service';


@Injectable({ providedIn: 'root' })
export class FaqService {
 
    private ADD_FAQ:any = Constants.BASE_ORG_URL+"add/faq";
    private GET_FAQ:any = Constants.BASE_ORG_URL+"get/faq";
    constructor(private http: HttpClient) {
    }
    async addFaq(data): Promise <any> 
    {
        const response:any = await this.http.post( Constants.BASE_URL + this.ADD_FAQ, data, AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }

    async getFaq(): Promise <any> 
    {
        try{
            const response:any = await this.http.get( Constants.BASE_URL + this.GET_FAQ, AuthService.getInstance().headersWithToken).toPromise();
            return  response;
        }
        catch(e)
        {
            return e;
        }
    }
}
 