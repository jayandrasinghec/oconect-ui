import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
 
export default class LocalStorageService {

  private static instance: LocalStorageService;
 	static getInstance( ) {
        if (!LocalStorageService.instance ) {
            LocalStorageService.instance = new LocalStorageService();           
        }
        return LocalStorageService.instance;
    }

	public getData(key: string): Observable<string> {
		const token: string = <string>localStorage.getItem(key);
		return of(token);
	}
    public saveData(key: string, value: string): LocalStorageService {
		localStorage.setItem(key, value);
		return this;
	}
    public clear(key: string) {
		localStorage.removeItem(key);
  	}
	public clearAll() {
		localStorage.clear()
  	}
	public getItem(key: string) {
	return localStorage.getItem(key);
	}

	public getJSONObject(key: string) {
		if(localStorage.getItem(key)){
			return JSON.parse(localStorage.getItem(key) );
		}
		return null;	
	}


}