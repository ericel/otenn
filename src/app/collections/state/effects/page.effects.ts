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

import * as actions from '@collections/state/actions/page.actions';
import * as fromPage from '@collections/state/reducers/page.reducer';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Page } from '@collections/state/models/page.model';
import { NotifyService } from '@shared/services/notify.service';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable()
export class PageEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
      const item: AngularFirestoreCollection<Page> = this.afs.collection(`o-t-pages`,
      (ref) => ref.orderBy('updatedAt', 'desc'));
        return item.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { id: doc.payload.doc.id, ...data } as Page;
            })
        })
    })
    .mergeMap(arr => [
      new actions.AddAll(arr),
      new actions.Success()
   ])
   .catch(err =>  Observable.of(new actions.Fail(err.message)) );

   // Listen for the 'CREATE' action
  @Effect() create$: Observable<Action> = this.actions$.ofType(actions.CREATE)
   .map((action: actions.Create) => action.page )
   .switchMap(page => {
       const ref = this.afs.doc<Page>(`o-t-pages/${page.id}`);
       return Observable.fromPromise( ref.set(Object.assign({}, page)));
   })
   .map(() => {
       this._notify.update('<strong>Page Added!</strong> Page Successfully Added. It May Require Review! You will be redirected!', 'info');
       return new actions.CreateSuccess()
   })

   // Listen for the 'UPDATE' action
   @Effect() update$: Observable<Action> = this.actions$.ofType(actions.UPDATE)
   .map((action: actions.Update) => action)
   .mergeMap(data => {
       const ref = this.afs.doc<Page>(`o-t-pages/${data.id}`)
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
  return of(this.afs.doc<Page>(`o-t-pages/${id}`).delete())
  .map(() =>  {
    //this._router.navigate(['../collections/c'], {relativeTo: this._route});
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
