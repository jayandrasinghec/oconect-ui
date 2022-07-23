import { Injectable,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class VideoProcessingService {
constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

public generateThumbnail(videoFile: any): Promise<string> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);
      video.addEventListener('canplay', event => {
        video.currentTime = 1000;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setTimeout(()=>{
           context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
           resolve(canvas.toDataURL());
        },500);
       

      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
     // video.src = window.URL.createObjectURL(videoFile);
      video.src = URL.createObjectURL(videoFile.nativeFile );     
      video.load();
     // this.document.getElementById('video_conteiner_wer').appendChild(video);
    });
  }


}