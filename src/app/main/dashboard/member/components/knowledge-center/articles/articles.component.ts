import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { ArticleWindowComponent } from '../../../../shared/article-window/article-window.component';
import LocalStorageService from 'app/services/localstorage.service';
import { AddArticleComponent } from './add-article/add-article.component';
import { ArticlesService } from 'app/services/articles.service';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ArticlesComponent implements OnInit {
  articles:any[];

  constructor(private dialog: MatDialog, 
    private articleService: ArticlesService) { }

  async ngOnInit(): Promise<void> {
     this.articles = [];
     this.articles = await this.articleService.getArticles();
  }

   readArticle(article): void
    {
        const dialogRef = this.dialog.open(ArticleWindowComponent, {
            panelClass: 'knowledgebase-article-dialog',
            data      : {article: article}
        });       
    }

    openDialog(event) {
        const dialogRef = this.dialog.open(AddArticleComponent, {
          width: '700px',
          data: { }
        });
    
        dialogRef.afterClosed().subscribe(async(result) => {
            let userInfo = LocalStorageService.getInstance().getItem('OConnect-UserInfo')
            const userInfoObj = JSON.parse(userInfo);
    
            if(result.submitClicked) {
                const resp = await this.articleService.addArticle({title: result.title, description: result.desc, created_by: userInfoObj._id});
                if(!resp.error){
                    this.articles.push(resp);
                }
            }
          });
    }    

}
