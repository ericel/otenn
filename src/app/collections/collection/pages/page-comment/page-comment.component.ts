import { Component, OnInit, Input } from '@angular/core';
import { Page } from '@collections/state/models/page.model';

@Component({
  selector: 'page-comment',
  templateUrl: './page-comment.component.html',
  styleUrls: ['./page-comment.component.css']
})
export class PageCommentComponent implements OnInit {
@Input() page: Page;
  constructor() { }

  ngOnInit() {

  }

}
