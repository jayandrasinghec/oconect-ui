import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Constants } from 'app/core/constants/constants';

@Injectable({
  providedIn: 'root'
})

export class DragdropService {

  COURSES_UPLOAD_URL:any = 'api/v1/admin/course/upload';
  constructor(private http: HttpClient) { }

  addFiles(images: File) {
   /* var arr = []
    var formData = new FormData();
    arr.push(images);

    arr[0].forEach((item, i) => {
      formData.append('coursePackage', arr[0][i]);
    })*/
    var formData = new FormData();
    formData.append('coursePackage', images);

    console.log('formData  ',formData);
    return this.http.post(Constants.LMS_BASE_URL + this.COURSES_UPLOAD_URL, formData, {
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

}