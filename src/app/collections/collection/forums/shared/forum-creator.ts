import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../auth/state/auth.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import * as forumActions from '@collections/state/actions/forum.actions';
import * as fromStore from '@collections/state';
import { SessionService } from '@shared/services/session.service';
import { SpinnerService } from '@shared/services/spinner.service';
import { Observable } from 'rxjs/Observable';
import { Forum } from '@collections/state/models/forum.model';
@Component ({
  selector: 'forum-creator',
  template:`
  <mat-card class='w-100 host animated shake'>
  <button mat-icon-button (click)="close()" class="menu-button" color="warn"><mat-icon>close</mat-icon></button>
   <div class='user-stable'  *ngIf='_auth.user | async as user'>
      <img [src]='user.photoURL' class='img-thumbnail user-img' [alt]='user.displayName.username'>
      <span class='auth'>As {{user.displayName.username}}</span>
   </div>
    <form [formGroup]="forumForm" (ngSubmit)="onSubmit()">
    <mat-form-field class='w-100'>
      <input matInput placeholder='Your Question'
      formControlName="title"
      #title
      minlength="10"
      maxlength="500"
      required
      >
      <mat-hint align="end">{{title.value?.length || 0}}/150</mat-hint>
    </mat-form-field>
    <div *ngIf="!forumForm.get('title').valid && forumForm.get('title').touched" class="alert alert-danger">
      <span *ngIf="forumForm.get('title').errors['nameIsForbidden']">Curse words Not Allowed</span>
      <span *ngIf="forumForm.get('title').errors['required']
       || forumForm.get('title').errors['maxlength'] || forumForm.get('title').errors['minlength']">
          Forum Title is required and must be between 10 to 150 characters
       </span>
    </div>
    <mat-form-field class='w-100' >
      <textarea matInput placeholder='More details on your question'
      formControlName="description"
      #description
      minlength="10"
      maxlength="500"
      required
      ></textarea>
      <mat-hint align="end">{{description.value?.length || 0}}/500</mat-hint>
    </mat-form-field>
    <div *ngIf="!forumForm.get('description').valid && forumForm.get('description').touched" class="alert alert-danger">
    <span *ngIf="forumForm.get('description').errors['nameIsForbidden']">Curse words Not Allowed</span>
    <span *ngIf="forumForm.get('description').errors['required']
     || forumForm.get('description').errors['maxlength'] || forumForm.get('description').errors['minlength']">
        Forum description is required and must be between 10 to 150 characters
     </span>
  </div>
    <button mat-raised-button color='primary' class='float-right'
     type='submit' [disabled]="!forumForm.valid"> <app-spinner name="showSpinner" [(show)]="showSpinner">
     <i class="fa fa-spinner fa-spin"></i></app-spinner>
           Add Thread
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
export class ForumCreator implements OnInit {
  @Input() collection;
  @Output() newthread = new EventEmitter<boolean>();
  forumForm: FormGroup;
  forbiddenUsernames = ['fuck', 'bitch'];
  loading$: Observable<boolean>;
  createdForum$: Observable<boolean>;
  showSpinner: any;
  constructor(
    public _auth: AuthService,
    private _session: SessionService,
    private _spinner: SpinnerService,
    private store: Store<fromStore.State>,
  ) {
    this.createdForum$ = this.store.pipe(select(fromStore.getSuccessForum));
    this.loading$ = this.store.pipe(select(fromStore.getLoadingForum));
  }

  ngOnInit () {
    this.buildForm();
  }

  onSubmit() {
    this._spinner.show('showSpinner');
    const newThread = new Forum(
      this._session.generate(),
      this.forumForm.value.title,
      this.forumForm.value.description,
      'Published',
      this.collectionTitle,
      'Forums',
      this._session.getCurrentTime(),
      this._session.getCurrentTime(),
      this.collectionKey,
      this._auth.userId
    );

    this.store.dispatch( new forumActions.Create(newThread) );
    this.createdForum$.subscribe((created) => {
      if(created) {
        setTimeout(() => {
          this.newthread.next(true);
          this.forumForm.reset();
         this._spinner.hideAll();
        }, 1000)
      } else {
      }
    } );
  }
  close() {
    if(confirm('Any changes will be discarded?')) {
      this.newthread.next(true);
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
      'title': new FormControl(null, [
         Validators.required,
         Validators.minLength(10),
         Validators.maxLength(150),
         this.forbiddenNames.bind(this)
        ]),
      'description': new FormControl(null, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(500),
          this.forbiddenNames.bind(this)
         ]),
    });
   }

   get collectionKey() {
     return this.collection.id;
   }

   get collectionTitle() {
     return this.collection.title;
   }
}
