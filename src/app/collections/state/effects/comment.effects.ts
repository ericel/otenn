import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import * as actions from '@collections/state/actions/comment.actions';
import * as fromComment from '@collections/state/reducers/comment.reducer';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Comment } from '@collections/state/models/comment.model';
import { NotifyService } from '@shared/services/notify.service';
import { Router } from '@angular/router';


@Injectable()
export class CommentEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
      const item: AngularFirestoreCollection<Comment> = this.afs.collection(`o-t-pages-comments`,
      (ref) => ref.orderBy('createdAt', 'desc'));
        return item.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { id: doc.payload.doc.id, ...data } as Comment;
            })
        })
    })
    //.delay(1000)
    .switchMap(arr => {
      const userObservables = arr.map(comment => this.afs.doc(`o-t-users/${comment.uid}`).valueChanges()
      );
      return Observable.combineLatest(...userObservables)
        .map((...eusers) => {
          arr.forEach((comment, index) => {
            comment['username'] = eusers[0][index].displayName.username;
            comment['avatar'] = eusers[0][index].photoURL;
          });
          return arr;
        });
    })
    .mergeMap(arr => [
      new actions.AddAll(arr),
      new actions.Success()
   ])
   .catch(err =>  Observable.of(new actions.Fail(err.message)) );
   // Listen for the 'CREATE' action
  @Effect() create$: Observable<Action> = this.actions$.ofType(actions.CREATE)
   .map((action: actions.Create) => action.comment )
   .mergeMap(comment => {
       const ref = this.afs.doc<Comment>(`o-t-pages-comments/${comment.id}`);
       return Observable.fromPromise( ref.set(Object.assign({}, comment)))
       .map(() =>  new actions.CreateSuccess())
       .catch(err => {
         this._notify.update(err.message, 'error');
         return Observable.of(new actions.Fail(err.message))
        });
   })



  @Effect() delete$: Observable<Action> = this.actions$
  .ofType(actions.DELETE)
  .map((action: actions.Delete) => action.id)
  .mergeMap(id => {
  return of(this.afs.doc<Comment>(`o-t-pages-comments/${id}`).delete())
  .map(() =>  {
    this.deleteDownvoteReply(id);
    this.deleteUpvoteReply(id);
    return new actions.Success()
  })
  .catch(err => Observable.of(new actions.Fail(err.message)));
  });
  private deleteDownvoteReply(replyId) {
    return this.afs.doc(`o-t-pages-comments-downvotes/${replyId}`).delete();
  }
  private deleteUpvoteReply(replyId) {
    return this.afs.doc(`o-t-pages-comments-upvotes/${replyId}`).delete();
  }
  constructor(
      private actions$: Actions,
      private afs: AngularFirestore,
      private _notify: NotifyService,
      private _router: Router
     ) { }
}
