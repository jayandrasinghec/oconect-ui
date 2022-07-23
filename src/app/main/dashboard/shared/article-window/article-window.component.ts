import { Component,OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-article-window',
  templateUrl: './article-window.component.html',
  styleUrls: ['./article-window.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class ArticleWindowComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ArticleWindowComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: any) { }

        ngOnInit(): void {
        }
      
        handleCloseClick() {
          this.dialogRef.close();
        }

}
