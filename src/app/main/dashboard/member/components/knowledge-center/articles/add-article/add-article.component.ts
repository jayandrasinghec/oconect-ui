import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {

  public articleTitle;
  public articleDesc;
  constructor(public dialogRef: MatDialogRef<AddArticleComponent>) { }

  ngOnInit(): void {
  }

  handleAddArticle(title, desc) {
    this.dialogRef.close({ submitClicked: true, title:title, desc:desc });
  }

  handleCloseClick() {
    this.dialogRef.close({ submitClicked: false});
  }

}
