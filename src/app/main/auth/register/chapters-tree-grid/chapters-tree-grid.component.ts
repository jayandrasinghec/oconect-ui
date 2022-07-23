import { Component, OnInit, Inject } from '@angular/core';
import { UtilsService } from 'app/services/Utils.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chapters-tree-grid',
  templateUrl: './chapters-tree-grid.component.html',
  styleUrls: ['./chapters-tree-grid.component.scss']
})
export class ChaptersTreeGridComponent implements OnInit {
  chapterForm: FormGroup;
  chapters: any
  selectedChapter: any
  constructor(private utilsService: UtilsService, public dialogRef: MatDialogRef <ChaptersTreeGridComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.chapters = data.chapters;
    this.selectedChapter = data.selectedChapter;
    console.log("this.chapters", this.chapters)
   }

  ngOnInit(): void {
  }

  closePopup () {
    this.dialogRef.close({ closepopup: true });
  }
  selectChapter (event){
    console.log(this.selectedChapter)
    this.dialogRef.close({ closepopup: true, selectedChapter: this.selectedChapter });
  }
  closeChapter (event){
    this.dialogRef.close({ closepopup: true, selectedChapter: this.selectedChapter });
  }

}
