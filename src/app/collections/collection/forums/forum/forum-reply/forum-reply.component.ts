import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Forum } from '@collections/state/models/forum.model';
import { Store, select } from '@ngrx/store';
import * as replyForumActions from '@collections/state/actions/replyforum.actions';
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-forum-reply',
  template: `
  <loading-comments [load]="(loading$ | async)"></loading-comments>
 <ng-container *ngIf="replyforums && collection">
 <section *ngIf="replyforums.length > 0; then replies else noreplies"></section>
 <ng-template #replies>
    <div class="card mar-20" *ngFor="let replyforum of replyforums">
    <div class="connector" [ngStyle]="{'background-color': collection.color}"></div>
    <div class="card-header">
            <img  [src]='replyforum.avatar' [alt]='replyforum.username'
            class="img-thumbnail forum-user" [ngStyle]="{'background-color': collection.color}">
            <span >{{replyforum.username}} Said:</span>
            <button mat-button class="auth-1-right-1" >9484 <mat-icon>favorite_border</mat-icon></button>
    </div>
    <div class="card-block">
      <div [innerHTML]="replyforum.reply"></div>
    </div>
    <div class="card-footer">
        <span class="date">Posted {{replyforum.createdAt}}</span>
        <button (click)="onReplyButton()" mat-button class="float-right" color="warn" ><mat-icon>reply</mat-icon> Reply</button>
    </div>
    </div>
 </ng-template>
 <ng-template #noreplies>
 <div class="display-5 text-center">
 <mat-card class="mar-20">
   <h1>No Replies yet! Be the first.</h1>
 </mat-card>
</div>
 </ng-template>
 </ng-container>
  `,
  styleUrls: ['./../forum.component.css'],
})
export class ForumReplyComponent implements OnInit {
@Input() forum: Forum;
@Input() collection;
@Output() replynew = new EventEmitter<any>();
loading$: Observable<boolean>;
replyforums;
  constructor(
    private store: Store<fromStore.State>,
  ) {
    this.loading$ = this.store.pipe(select(fromStore.getLoadingReplyforum));
  }

  ngOnInit() {
    const replies = this.store.select(fromStore.getAllReplyForums);
    this.store.dispatch(  new replyForumActions.Query() );
    replies.subscribe(data => {
      this.replyforums =  data.filter((item) => {
         return item.forumId === this.forum.id;
       });
    });
  }

  onReplyButton() {
    this.replynew.emit();

  }
}
