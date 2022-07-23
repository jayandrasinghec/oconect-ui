import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject , Observable, of} from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import {Constants} from '../core/constants/constants';  
import AuthService from './auth.service';



@Injectable({ providedIn: 'root' })
export class OrganisationService {
 
    CREATE_ORGANISATION:any = 'api/v1/org';
    GET_ORGANISATION:any = 'api/v1/org';
    constructor(private http: HttpClient) {
    }
    async createOrganisation(data): Promise <any> 
    {
        const response:any = await this.http.post( Constants.BASE_URL + this.CREATE_ORGANISATION, data,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }

    async getOrganisation(): Promise <any> 
    {
        try{
            const response:any = await this.http.get( Constants.BASE_URL + this.GET_ORGANISATION, AuthService.getInstance().headersWithToken).toPromise();
            return  response;
        }
        catch(e)
        {
            return e;
        }
    }
}
 