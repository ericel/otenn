import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Forum } from '@collections/state/models/forum.model';
import { Store, select } from '@ngrx/store';
import * as replyForumActions from '@collections/state/actions/replyforum.actions';
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../../auth/state/auth.service';

@Component({
  selector: 'app-forum-reply',
  template: `
  <loading-comments [load]="(loading$ | async)"></loading-comments>
 <ng-container *ngIf="replyforums && collection">
 <section *ngIf="replyforums.length > 0; then replies else noreplies"></section>
 <ng-template #replies>
    <div class="card mar-20 reply-forums" *ngFor="let replyforum of replyforums">
    <div class="connector" [ngStyle]="{'background-color': collection.color}"></div>
    <div class="card-header">
            <img  [src]='replyforum.avatar' [alt]='replyforum.username'
            class="img-thumbnail forum-user" [ngStyle]="{'background-color': collection.color}">
            <span >{{replyforum.username | shorten: '8': '..'}} Said:</span>
           <!-- <button mat-button class="auth-1-right-1" >9484 <mat-icon>favorite_border</mat-icon></button>-->

            <button class="menu-button" mat-icon-button [matMenuTriggerFor]="forumMenu">
            <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #forumMenu="matMenu" xPosition="before">
                <div *ngIf="_auth.user | async; then authenticated else guest"></div>
                <ng-template #guest>
                   <a mat-menu-item>Report</a>
                </ng-template>
                <ng-template #authenticated>
                  <ng-container *ngIf="_auth.user | async as user">
                      <a mat-menu-item>Report</a>
                      <a mat-menu-item *ngIf=" user.uid === replyforum.uid" (click)="onDelete(replyforum.id)">Delete</a>
                  </ng-container>
                </ng-template>
            </mat-menu>
    </div>
    <div class="card-block">
     <div class="row">
      <div class="col-md-1">
      <ng-container>
        <vote-replies [replyAuthId]="replyforum.uid"
        [replyId]="replyforum.id">
        </vote-replies>
      </ng-container>
      </div>
      <div class="col-md-11">
         <div [innerHTML]="replyforum.reply"></div>
      </div>
     </div>

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
showSpinner: any;
  constructor(
    private store: Store<fromStore.State>,
    public _auth: AuthService
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

  onDelete(id) {
    this.store.dispatch(new replyForumActions.Delete(id));
  }
}
