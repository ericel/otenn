import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../auth/state/auth.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import * as replyForumActions from '@collections/state/actions/replyforum.actions';
import * as fromStore from '@collections/state';
import { SessionService } from '@shared/services/session.service';
import { SpinnerService } from '@shared/services/spinner.service';
import { Observable } from 'rxjs/Observable';
import { Forum, ReplyForum } from '@collections/state/models/forum.model';
@Component ({
  selector: 'reply-creator',
  template:`
  <mat-card class='w-100 host animated shake'>
  <button mat-icon-button (click)="close()" class="menu-button" color="warn"><mat-icon>close</mat-icon></button>
   <div class='user-stable'  *ngIf='_auth.user | async as user'>
      <img [src]='user.photoURL' class='img-thumbnail user-img' [alt]='user.displayName.username'>
      <span class='auth'>As {{user.displayName.username}}</span>
   </div>
    <form [formGroup]="forumForm" (ngSubmit)="onSubmit()">
    <mat-form-field class='w-100' >
      <textarea matInput placeholder='More details on your reply'
      formControlName="reply"
      #reply
      minlength="10"
      maxlength="500"
      required
      ></textarea>
      <mat-hint align="end">{{reply.value?.length || 0}}/500</mat-hint>
    </mat-form-field>
    <div *ngIf="!forumForm.get('reply').valid && forumForm.get('reply').touched" class="alert alert-danger">
    <span *ngIf="forumForm.get('reply').errors['nameIsForbidden']">Curse words Not Allowed</span>
    <span *ngIf="forumForm.get('reply').errors['required']
     || forumForm.get('reply').errors['maxlength'] || forumForm.get('reply').errors['minlength']">
        Reply is required and must be between 10 to 150 characters
     </span>
  </div>
    <button mat-raised-button color='primary' class='float-right'
     type='submit'
     [disabled]="!forumForm.valid">
     <app-spinner name="showSpinner" [(show)]="showSpinner"><i class="fa fa-spinner fa-spin"></i></app-spinner>
           Reply To Thread
    </button>
    </form>
    <div class='clearfix'></div>
  </mat-card>
  `,
  styles: [`
  .host {

  }
  .user-img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    float: left;
  }
  .auth {
    line-height: 5;
    padding-top: 10px;
    margin-left: 5px;
  }
  textarea {
    min-height: 200px;
  }
  `]
})
export class ReplyCreator implements OnInit {
  @Input() forum;
  @Output() newreply = new EventEmitter<boolean>();
  forumForm: FormGroup;
  forbiddenUsernames = ['fuck', 'bitch'];
  loading$: Observable<boolean>;
  createdForum$: Observable<boolean>;
  constructor(
    public _auth: AuthService,
    private _session: SessionService,
    private _spinner: SpinnerService,
    private store: Store<fromStore.State>,
  ) {
    this.createdForum$ = this.store.pipe(select(fromStore.getSuccessReplyForum));
    this.loading$ = this.store.pipe(select(fromStore.getLoadingReplyforum));
  }

  ngOnInit () {
    this.buildForm();
  }

  onSubmit() {
    this._spinner.show('showSpinner');
    const newReply = new ReplyForum(
      this._session.generate(),
      this.forumForm.value.reply,
      this._session.getCurrentTime(),
      this.forumKey,
      this._auth.userId
    );
    this.store.dispatch( new replyForumActions.Create(newReply) );
    this.createdForum$.subscribe((created) => {
      if(created) {
        setTimeout(() => {
          this.newreply.next(true);
          this.forumForm.reset();
         this._spinner.hideAll();
        }, 1000)
      } else {
      }
    } );
  }
  close() {
    if(confirm('Any changes will be discarded?')) {
      this.newreply.next(true);
      this.forumForm.reset();
    }

  }
  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  private buildForm() {
    this.forumForm = new FormGroup({
      'reply': new FormControl(null, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(500),
          this.forbiddenNames.bind(this)
         ]),
    });
   }

   get forumKey() {
     return this.forum.id;
   }

   get forumTitle() {
     return this.forum.title;
   }
}
