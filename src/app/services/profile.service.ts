import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from 'app/core/constants/constants';
import LocalStorageService from 'app/services/localstorage.service';

@Injectable()
export class ProfileService implements Resolve<any>
{
    timeline: any;
    about: any;
    photosVideos: any;
    userInfo:any;

    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.timelineOnChanged = new BehaviorSubject({});
        this.aboutOnChanged = new BehaviorSubject({});
        this.photosVideosOnChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
              //  this.getTimeline(),
                this.getAbout(),
              //  this.getPhotosVideos()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get timeline
     */
    getTimeline(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.get('api/profile-timeline')
                .subscribe((timeline: any) => {
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]>
    {
        this.userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
        this.userInfo = JSON.parse(this.userInfo);
        return new Promise((resolve, reject) => {

            this._httpClient.get(Constants.BASE_URL + Constants.BASE_USER_URL )
                .subscribe((about: any) => {
                    this.about = {};
                    this.about.user = about.find(x => x._id == this.userInfo._id);
                    this.about.chapterMembers = about.filter(x => x.members[0].chapter == this.about.user.members[0].chapter
                                                                && x._id != this.userInfo._id)
                    console.log('getAbout', this.about)
                    this.aboutOnChanged.next(this.about);
                    resolve(this.about);
                }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.get('api/profile-photos-videos')
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }

}
