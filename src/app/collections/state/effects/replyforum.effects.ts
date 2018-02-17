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

import * as actions from '@collections/state/actions/replyforum.actions';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ReplyForum } from '@collections/state/models/forum.model';
import { NotifyService } from '@shared/services/notify.service';
import { Router } from '@angular/router';


@Injectable()
export class ReplyForumEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
      const item: AngularFirestoreCollection<ReplyForum> = this.afs.collection(`o-t-forum-replies`,
      (ref) => ref.orderBy('createdAt', 'desc'));
        return item.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { id: doc.payload.doc.id, ...data } as ReplyForum;
            })
        })
    })
    //.delay(1000)
    .switchMap(arr => {
      const userObservables = arr.map(replyforum => this.afs.doc(`o-t-users/${replyforum.uid}`).valueChanges()
      );
      return Observable.combineLatest(...userObservables)
        .map((...eusers) => {
          arr.forEach((replyforum, index) => {
            replyforum['username'] = eusers[0][index].displayName.username;
            replyforum['avatar'] = eusers[0][index].photoURL;
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
   .map((action: actions.Create) => action.replyforum )
   .mergeMap(replyforum => {
       const ref = this.afs.doc<ReplyForum>(`o-t-forum-replies/${replyforum.id}`);
       return Observable.fromPromise( ref.set(Object.assign({}, replyforum)))
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
    return of(this.afs.doc<ReplyForum>(`o-t-forum-replies/${id}`).delete())
  .map(() => {
    this.deleteUpvoteReply(id);
    return new actions.Success();
  })
  .catch(err => Observable.of(new actions.Fail(err.message)));
  });

 private deleteUpvoteReply(replyId) {
   return this.afs.doc(`o-t-forum-replies-upvotes/${replyId}`).delete();
 }
  constructor(
      private actions$: Actions,
      private afs: AngularFirestore,
      private _notify: NotifyService,
      private _router: Router
     ) { }
}
