import { Injectable } from '@angular/core';
import { Constants } from 'app/core/constants/constants';
import { HttpClient } from '@angular/common/http';
import AuthService from 'app/services/auth.service';

@Injectable({providedIn : "root"})
export class FileManagementService{

    private GET_DOCS:any = "api/v1/document/chapter/";
    private GET_VIDEOS:any = "api/v1/video/chapter/";

    constructor(private http: HttpClient) {
    }

    async getDocuments(chapterId: any): Promise <any> 
    {
        try{
            const response:any = await this.http.get( Constants.LMS_BASE_URL + this.GET_DOCS+chapterId, AuthService.getInstance().headersWithToken).toPromise();
            return  response;
        }
        catch(e)
        {
            return e;
        }   
    }

    async getVideos(chapterId: any): Promise <any> 
    {
        try{
            const response:any = await this.http.get( Constants.LMS_BASE_URL + this.GET_VIDEOS+chapterId, AuthService.getInstance().headersWithToken).toPromise();
            return  response;
        }
        catch(e)
        {
            return e;
        }   
    }
}