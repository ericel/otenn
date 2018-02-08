import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Page } from '@collections/state/models/page.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '@shared/services/session.service';

import { Store, select } from '@ngrx/store';
import * as commentActions from '@collections/state/actions/comment.actions';
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';
import { Comment } from '@collections/state/models/comment.model';
import { SpinnerService } from '@shared/services/spinner.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'page-comment',
  templateUrl: './page-comment.component.html',
  styleUrls: ['./page-comment.component.css']
})
export class PageCommentComponent implements OnInit, OnDestroy {
@Input() page: Page;
commentForm: FormGroup;
comment: Comment;
comments: Observable<fromStore.State>;
coms: Observable<any>;
sub: Subscription;
forbiddenUsernames = ['fuck', 'bitch'];
loading$: Observable<boolean>;
createdCom$: Observable<boolean>;
  constructor(
    private _session: SessionService,
    private _spinner: SpinnerService,
    private store: Store<fromStore.State>,
    private _router: Router
  ) {

    this.createdCom$ = this.store.pipe(select(fromStore.getSuccessComment));
    this.loading$ = this.store.pipe(select(fromStore.getLoadingComment));
  }

  ngOnInit() {
    this.getComments();
    this.sub = this._router.events.subscribe(event => {
      if(event.constructor.name === 'NavigationStart') {
        this.getComments();
     }
    });

    this.commentform();
  }

  private getComments() {
    this.coms = this.store.select(fromStore.getAllComments);
    this.store.dispatch(  new commentActions.Query() );
    this.coms.subscribe(data => {
      this.comments =  data.filter((item) => {
         return item.pageId === this.page.id;
       });
    });
  }
  onSubmit() {
    this._spinner.show('showSpinner');
    const newComment = new Comment(
      this._session.generate(),
      this.page.id,
      this.commentForm.value.comment,
      this.page.collection,
      this._session.getCurrentTime(),
      this.page.collectionKey,
      'uid'
    );
    this.store.dispatch( new commentActions.Create(newComment) );
    this.createdCom$.subscribe((created) => {
      if(created) {
        setTimeout(() => {
          this.commentForm.reset();
         this._spinner.hideAll();
        }, 1000)
      } else {
      }
    } );
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  private commentform() {
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, [
         Validators.required,
         Validators.minLength(4),
         Validators.maxLength(1500),
         this.forbiddenNames.bind(this)
        ]),
    });
   }

   onDelete(id) {
    this.store.dispatch( new commentActions.Delete(id) );
   }

   ngOnDestroy () {
       this.sub.unsubscribe();
   }
}
