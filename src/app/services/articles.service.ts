import { Injectable } from '@angular/core';
import { Constants } from 'app/core/constants/constants';
import { HttpClient } from '@angular/common/http';
import AuthService from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private ADD_ARTICLE:any = Constants.BASE_ORG_URL+"add/article";
  private GET_ARTICLES:any = Constants.BASE_ORG_URL+"get/articles";

  constructor(private http: HttpClient) {
  }

  async addArticle(data): Promise <any> 
  {
    const response:any = await this.http.post( Constants.BASE_URL + this.ADD_ARTICLE, data, AuthService.getInstance().headersWithToken).toPromise();
    return  response;
  }

  async getArticles(): Promise <any> 
  {
    try{
        const response:any = await this.http.get( Constants.BASE_URL + this.GET_ARTICLES, AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
    catch(e)
    {
      return e;
    }
  }
}
