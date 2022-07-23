import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { map, tap, catchError } from "rxjs/operators";
import {Constants} from '../core/constants/constants';  
import AuthService from './auth.service';
import { UploadFile } from 'ngx-uploader';
import { Subject , Observable, of,throwError} from 'rxjs'; 
@Injectable()
export class UploadService {

    SIGNED_URL:any = 'api/v1/s3/signed/create';
    UPLOAD_URL:any = 'api/v1/file/upload';
    COURSES_UPLOAD_URL:any = 'course/upload';
    GOOFLE_DRIVE_UPLOAD:any = 'upload';
    constructor(	private http: HttpClient) {
    }

   async getSignedUrl(data): Promise <any> 
    {
        console.log('HeadersWith Token  ',AuthService.getInstance().headersWithToken);
        const response:any = await this.http.post( Constants.BASE_URL + this.SIGNED_URL, data,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
  /*  async upload(url,file): Promise <any>
    {       
      //  const response:any = await this.http.post(Constants.BASE_URL + this.UPLOAD_URL,{file:file,}).toPromise();
       const response:any = await this.http.put(url,file).toPromise();
       return  response;
    }*/
public async uploadfileAWSS3(url: string,  file: File, contenttype: string ,): Promise<any>
{
 /// const httpHeaders = this.httpUtils.getHttpheaderWithoutAuthorization(contenttype);

  console.log(' uploadfileAWSS3 url    :', url, file);
  const response: any = await this.http.put(url, file , {headers:  {'Content-Type': contenttype} } ).toPromise();
  return response;
}
/*-this methode using for subscribe upload event*/
public  uploadfileToS3(url: string,  file: File, contenttype: string ,) 
{
  console.log(' uploadfileAWSS3 url    :', url, file);
  return this.http.put(url, file  , {
      headers:  {'Content-Type': contenttype},
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
}
public uploadtoGoogleDrive(file:File){
    var formData = new FormData();
    formData.append('googlefile', file);
    console.log('formData  ',formData);
    return this.http.post(Constants.BASE_GOOGLE_API + this.GOOFLE_DRIVE_UPLOAD, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
}
errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

public async uploadCourse(file: any ): Promise<any>
{
  console.log(' upload url    :',file);
  const url:any = Constants.LMS_BASE_URL + Constants.BASE_ADMIN_URL+ this.COURSES_UPLOAD_URL
  const response: any = await this.http.post(url, file, {headers:  {'Content-Type': 'application/x-www-form-urlencoded'}} ).toPromise();
  return response;
}


}