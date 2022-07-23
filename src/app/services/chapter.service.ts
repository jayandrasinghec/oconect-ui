import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject , Observable, of} from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import {Constants} from '../core/constants/constants';  
import AuthService from './auth.service';
import LocalStorageService from './localstorage.service';



@Injectable()
export class ChapterService {
    
    CREATE_CHAPTER:any = 'chapter';
    INVITE_MEMBER:any = 'api/v1/member/invite';
    ADD_MEMBER:any = 'api/v1/admin/member/add';
    COURSE_CREATE:any = 'api/v1/admin/course/create';
    ENROLL_USER:any = 'api/v1/admin/course/chapter/enroll';
    MEMBERS_CHAPTER:any = 'chapters'
    private INVITE_LIST_URL:any = 'invite/'

    private chapter_id:any;
    private chapter_name:any;
    
    constructor(private http: HttpClient) {
    }

    
    /*------- Updating Chapter ---------------*/
    private updateChaptersData = new Subject();
    updateChaptersData$ = this.updateChaptersData.asObservable();
    updateChapters(event: any) {        
        this.updateChaptersData.next(event);
    }

    /*------- Updating Members ---------------*/
    private updateMembersData = new Subject();
    updateMembersData$ = this.updateMembersData.asObservable();
    updateMembers(event: any) {        
        this.updateMembersData.next(event);
    }

    public set chapterID(chapterID:any){
        this.chapter_id = chapterID;
    }
    public get chapterID(){
        return this.chapter_id  ;
    }

    public set chapterName(chapterName:any){
        this.chapter_name = chapterName;
    }
    public get chapterName(){
        return this.chapter_name  ;
    }

    async createChapter(data): Promise <any> 
    {
        const response:any = await this.http.post( Constants.BASE_URL + Constants.BASE_ORG_URL +this.CREATE_CHAPTER, data,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
     async getChapter(orgID:any,chapterID:any): Promise <any> 
    {
        const response:any = await this.http.get( Constants.BASE_URL + Constants.BASE_ORG_URL + `${orgID}/chapters/${chapterID}` ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
    }
    async getChapters(orgID:any): Promise <any> 
    {
        try{
            const response:any = await this.http.get( Constants.BASE_URL + Constants.BASE_ORG_URL +`${orgID}/chapters` ,AuthService.getInstance().headersWithToken).toPromise();
            return  response;
            }
            catch(e){
                return e;
            }
    }
      async getChapterByWeightage(orgID:any,weightage:any): Promise <any>       
    {
        if(orgID) {
            try{
                const response:any = await this.http.get( Constants.BASE_URL + Constants.BASE_ORG_URL +`${orgID}/chapters/weightage/${weightage}` ,AuthService.getInstance().headersWithToken).toPromise();
                return  response;
                }
                catch(e){
                    return e;
                }
        }
        return null;
        
    }
    async getOrgChapters(orgID:any): Promise <any> 
    {
        if(orgID) {
            try{
                const response:any = await this.http.get( Constants.BASE_URL + Constants.BASE_ORG_URL +`${orgID}/chapters` ,AuthService.getInstance().headersWithToken).toPromise();
                return  response;
                }
                catch(e){
                    return e;
                }
        }
        return null;
        
    }
    async getChapterById(chapterID:any): Promise <any> 
    {
        try{
        const response:any = await this.http.get( Constants.BASE_URL + Constants.BASE_ORG_URL +`chapter/${chapterID}` ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    async sendInvitation(data:any): Promise <any> 
    {
        try{
            const loggedInUser: any = JSON.parse(LocalStorageService.getInstance().getItem("OConnect-UserInfo"));
            data.createdBy = loggedInUser._id
        const response:any = await this.http.post( Constants.BASE_URL +this.INVITE_MEMBER,data ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    async addMember(data:any): Promise <any> 
    {
        try{
        const response:any = await this.http.post( Constants.BASE_URL +this.ADD_MEMBER,data ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
        
    async getUsers(): Promise <any> 
    {
        try{
        const response:any = await this.http.get( Constants.BASE_URL +Constants.BASE_USER_URL ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }

    async createChapterCourse(data : any): Promise <any> 
    {
        try{
            const response:any = await this.http.post( Constants.LMS_BASE_URL +this.COURSE_CREATE ,data ,AuthService.getInstance().headersWithToken).toPromise();
            return  response;
            }
            catch(e){
                return e;
            }
    }
    
    async enrollUserWithChapterCourse(data : any): Promise <any> 
    {
        try{
            const response:any = await this.http.post( Constants.LMS_BASE_URL +this.ENROLL_USER ,data ,AuthService.getInstance().headersWithToken).toPromise();
            return  response;
            }
            catch(e){
                return e;
            }
    }



    /*-------------------------*/
     async getInvitedMembes(userID:any): Promise <any> 
    {
        try{
        const response:any = await this.http.get( Constants.BASE_URL+Constants.BASE_MEMBER_URL+this.INVITE_LIST_URL+userID ,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    async getMembers( ): Promise <any> 
    {
        try{
        const response:any = await this.http.get(Constants.BASE_URL+Constants.BASE_USER_URL,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    async getMembersinChapters(chapters:any): Promise <any> {
         try{
        const response:any = await this.http.post(Constants.BASE_URL+Constants.BASE_MEMBER_URL+this.MEMBERS_CHAPTER,chapters,AuthService.getInstance().headersWithToken).toPromise();
        return  response;
        }
        catch(e){
            return e;
        }
    }
    
}
 