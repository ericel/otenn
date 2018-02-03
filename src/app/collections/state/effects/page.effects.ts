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
    .map(arr => {
        console.log(arr)
        return new actions.AddAll(arr)
    })

   // Listen for the 'CREATE' action
  @Effect() create$: Observable<Action> = this.actions$.ofType(actions.CREATE)
   .map((action: actions.Create) => action.page )
   .switchMap(page => {
       const ref = this.afs.doc<Page>(`o-t-pages/${page.id}`)
       return Observable.fromPromise( ref.set(Object.assign({}, page)))
   })
   .map(() => {
    this._notify
    .update('<strong>Page Added!</strong> Page Successfully Added. It May Require Review! You will be redirected!', 'info');
       return new actions.Success()
   })

  constructor(
      private actions$: Actions,
      private afs: AngularFirestore,
      private _notify: NotifyService
     ) { }
}
