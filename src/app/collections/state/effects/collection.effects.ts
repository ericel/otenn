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
import 'rxjs/add/observable/combineLatest';
import * as actions from '@collections/state/actions/collection.actions';
import * as fromCollection from '@collections/state/reducers/collection.reducer';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Collection } from '@collections/state/models/collection.model';
import { Router } from '@angular/router';
import { NotifyService } from '@shared/services/notify.service';


@Injectable()
export class CollectionEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
      const item: AngularFirestoreCollection<Collection> = this.afs.collection(`o-t-collections`,
      (ref) => ref.orderBy('updatedAt', 'desc'));
        return item.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { id: doc.payload.doc.id, ...data } as Collection;
            });
        });

    })
    .switchMap(arr => {
      const userObservables = arr.map(collection => this.afs.doc(`o-t-users/${collection.uid}`).valueChanges()
      );
      return Observable.combineLatest(...userObservables)
        .map((...eusers) => {
          arr.forEach((collection, index) => {
            collection['username'] = eusers[0][index].displayName.username;
            collection['avatar'] = eusers[0][index].photoURL;
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
        .map((action: actions.Create) => action.collection )
        .switchMap(collection => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${collection.id}`)
            return Observable.fromPromise( ref.set(Object.assign({}, collection)))
        })
        .map(() => {
            this._notify.update('<strong>Collection Added!</strong> Collection Successfully Added. You will be redirected!', 'info');
            return new actions.CreateSuccess()
        })

    // Listen for the 'UPDATE' action
    @Effect() update$: Observable<Action> = this.actions$.ofType(actions.UPDATE)
        .map((action: actions.Update) => action)
        .mergeMap(data => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${data.id}`)
            return Observable.fromPromise( ref.update(Object.assign({}, data.changes)) )
            .map(() =>   new actions.CreateSuccess() )
            .catch(err =>  Observable.of(new actions.Fail(err.message)) );
        });

    // Listen for the 'DELETE' action

 /*   @Effect() delete$: Observable<Action> = this.actions$.ofType(actions.DELETE)
        .map((action: actions.Delete) => action.id )
        .switchMap(id => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${id}`)
            return Observable.fromPromise( ref.delete() )
        })
        .map(() => {
            return new actions.Success()
        })
*/
  @Effect() delete$: Observable<Action> = this.actions$
  .ofType(actions.DELETE)
  .map((action: actions.Delete) => action.id)
  .mergeMap(id => {
    return of(this.afs.doc<Collection>(`o-t-collections/${id}`).delete())
    .map(() =>  {
      this._router.navigate(['./collections/c']);
      return new actions.Success();
    })
    .catch(err => Observable.of(new actions.Fail(err.message)));
  });




    constructor(
      private actions$: Actions,
      private afs: AngularFirestore,
      private _router: Router,
      private _notify: NotifyService
     ) { }
}
