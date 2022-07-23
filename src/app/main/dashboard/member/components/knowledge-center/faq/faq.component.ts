import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { FaqService } from 'app/services/faq.service';
import LocalStorageService from 'app/services/localstorage.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FaqComponent implements OnInit {
  faqsFiltered:any[];
  searchInput: any;
  searchForm: FormGroup;
  constructor(public dialog: MatDialog,
    private faqService: FaqService) { }

   async ngOnInit() {
    this.searchInput = new FormControl('');
    this.faqsFiltered = [];

    this.faqsFiltered = await this.faqService.getFaq();
  }
  openDialog(event) {
    const dialogRef = this.dialog.open(AddFaqComponent, {
      width: '700px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(async(result) => {
        let userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
        const userInfoObj = JSON.parse(userInfo);

        if(result.submitClicked) {
            const resp = await this.faqService.addFaq({question: result.ques, answer: result.ans, created_by: userInfoObj._id});
            if(!resp.error){
                this.faqsFiltered.push(resp);
            }
        }
      });
}

}
