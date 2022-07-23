import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { UploadService} from '../../services/upload.service';

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    NgxUploaderModule
  ],
  exports:[UploadComponent],
  providers:[UploadService],
  entryComponents:[UploadComponent]
})
export class SharedModule { }
