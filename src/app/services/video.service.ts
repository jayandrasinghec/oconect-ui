import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'app/core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private GET_ALL_VIDEOS:any = Constants.LMS_BASE_URL+"api/v1/get/videos";
  private GET_RECENT_VIDEOS:any = Constants.LMS_BASE_URL+"api/v1/get/recent/videos";
  private GET_CHAPTER_VIDEOS:any = Constants.LMS_BASE_URL+"api/v1/video/chapter/";
  
  constructor(private http: HttpClient) { }

  async getVideos(): Promise <any> 
  {
      try{
          const response:any = await this.http.get(this.GET_ALL_VIDEOS).toPromise();
          return  response;
      }
      catch(e)
      {
          return e;
      }
  }

  async getChapterVideos(chpaterId:any): Promise <any> 
  {
      try{
          const response:any = await this.http.get(this.GET_CHAPTER_VIDEOS+chpaterId).toPromise();
          return  response;
      }
      catch(e)
      {
          return e;
      }
  }
  
  async getRecentVideos(): Promise <any> {
    try{
      const response:any = await this.http.get(this.GET_RECENT_VIDEOS).toPromise();
      return  response;
    }
    catch(e)
    {
        return e;
    }
  }
}
