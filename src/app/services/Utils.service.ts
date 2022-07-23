import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject , Observable, of} from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import {Constants} from '../core/constants/constants';  
import * as path from 'path';
@Injectable()
export class UtilsService {

     
    constructor() {
    }

    addTimeStatp (name: string){
		console.log('file name', path.basename(name,path.extname(name)));
		console.log('extension name',  path.extname(name));
		return	path.basename(name,path.extname(name))+new Date().getTime()+path.extname(name);
		 
	}
    searchReplaceSpace(str){
		var reg = new RegExp("[ ]+","g");
		return str.replace(reg,"_");
	}




}