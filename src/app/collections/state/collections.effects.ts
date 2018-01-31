import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import * as actions from '@collections/state/collections.actions';
import * as fromCollection from '@collections/state/collections.reducer';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Collection } from '@collections/state/collections.model';

@Injectable()
export class CollectionEffects {

  // Listen for the 'QUERY' action, must be the first effect you trigger
  @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
    .switchMap(action => {
        const ref = this.afs.collection<Collection>('o-t-collections')
        return ref.snapshotChanges().map(arr => {
            return arr.map( doc => {
                const data = doc.payload.doc.data()
                return { $key: doc.payload.doc.id, ...data } as Collection;
            })
        })
    })
    .map(arr => {
        console.log(arr)
        return new actions.AddAll(arr)
    })

    // Listen for the 'CREATE' action
    @Effect() create$: Observable<Action> = this.actions$.ofType(actions.CREATE)
        .map((action: actions.Create) => action.collection )
        .switchMap(collection => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${collection.$key}`)
            return Observable.fromPromise( ref.set(collection) )
        })
        .map(() => {
            return new actions.Success()
        })

    // Listen for the 'UPDATE' action
    @Effect() update$: Observable<Action> = this.actions$.ofType(actions.UPDATE)
        .map((action: actions.Update) => action)
        .switchMap(data => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${data.id}`)
            return Observable.fromPromise( ref.update(data.changes) )
        })
        .map(() => {
            return new actions.Success()
        })

    // Listen for the 'DELETE' action

    @Effect() delete$: Observable<Action> = this.actions$.ofType(actions.DELETE)
        .map((action: actions.Delete) => action.id )
        .switchMap(id => {
            const ref = this.afs.doc<Collection>(`o-t-collections/${id}`)
            return Observable.fromPromise( ref.delete() )
        })
        .map(() => {
            return new actions.Success()
        })

    constructor(private actions$: Actions, private afs: AngularFirestore) { }
}
