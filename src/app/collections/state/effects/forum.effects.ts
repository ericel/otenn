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

import * as actions from '@collections/state/actions/forum.actions';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Forum } from '@collections/state/models/forum.model';
import { NotifyService } from '@shared/services/notify.service';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable()
export class ForumEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
      const item: AngularFirestoreCollection<Forum> = this.afs.collection(`o-t-forums`,
      (ref) => ref.orderBy('updatedAt', 'desc'));
        return item.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { id: doc.payload.doc.id, ...data } as Forum;
            })
        })
    })
    .switchMap(arr => {
      const userObservables = arr.map(forum => this.afs.doc(`o-t-users/${forum.uid}`).valueChanges()
      );
      return Observable.combineLatest(...userObservables)
        .map((...eusers) => {
          arr.forEach((forum, index) => {
            forum['username'] = eusers[0][index].displayName.username;
            forum['avatar'] = eusers[0][index].photoURL;
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
   .map((action: actions.Create) => action.forum )
   .switchMap(forum => {
       const ref = this.afs.doc<Forum>(`o-t-forums/${forum.id}`);
       return Observable.fromPromise( ref.set(Object.assign({}, forum)));
   })
   .map(() => {
       this._notify
       .update('<strong>Forum Created!</strong> Forum Successfully Added. It May Require Review! You will be redirected!',
        'info');
       return new actions.CreateSuccess()
   })

   // Listen for the 'UPDATE' action
   @Effect() update$: Observable<Action> = this.actions$.ofType(actions.UPDATE)
   .map((action: actions.Update) => action)
   .mergeMap(data => {
       const ref = this.afs.doc<Forum>(`o-t-forums/${data.id}`)
       return Observable.fromPromise( ref.update(Object.assign({}, data.changes)) )
       .map(() =>  new actions.CreateSuccess())
       .catch(err => {
         this._notify.update(err.message, 'error');
         return Observable.of(new actions.Fail(err.message))
        });
   })
// Listen for the 'DELETE' action
  @Effect() delete$: Observable<Action> = this.actions$
  .ofType(actions.DELETE)
  .map((action: actions.Delete) => action.id)
  .mergeMap(id => {
  return of(this.afs.doc<Forum>(`o-t-forums/${id}`).delete())
  .map(() =>  {
    this._router.navigate(['../collections/c'], {relativeTo: this._route});
    return new actions.Success();
  })
  .catch(err => Observable.of(new actions.Fail(err.message)));
  });

  constructor(
      private actions$: Actions,
      private afs: AngularFirestore,
      private _notify: NotifyService,
      private _router: Router,
      private _route: ActivatedRoute
  ) { }
}
