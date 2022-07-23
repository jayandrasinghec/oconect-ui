import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {
  public faqQues;
  public faqAns;
  constructor(public dialogRef: MatDialogRef<AddFaqComponent>) { }

  ngOnInit(): void {
  }

  handleAddFaqClick(ques, ans) {
    this.dialogRef.close({ submitClicked: true, ques:ques, ans:ans });
  }

  handleCloseClick() {
    this.dialogRef.close({ submitClicked: false});
  }

}
