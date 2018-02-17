import { Injectable } from '@angular/core';
import { NotifyService } from '@shared/services/notify.service';
import { SpinnerService } from '@shared/services/spinner.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Collection } from '@collections/state/models/collection.model';
import { Observable } from 'rxjs/Observable';
import { Page } from '@collections/state/models/page.model';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { expand, takeWhile, mergeMap, take } from 'rxjs/operators';
@Injectable()
export class CollectionsService {

  constructor (
    private _notify: NotifyService,
    private _spinner: SpinnerService,
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
  ) {}



  getCollection(key): Observable<Collection | null> {
    const item = this._afs.doc(`o-t-collections/${key}`).valueChanges() as Observable<Collection | null>;
    return item;
  }

  getPage(key): Observable<Collection | null> {
    const item = this._afs.doc(`o-t-pages/${key}`).valueChanges() as Observable<Collection | null>;
    return item;
  }


  getCommentCount(id, condition, collection) {
    return this._afs.collection(collection, ref => ref.where(condition, '==', id) )
    .valueChanges();
  }


  deleteCollection(path: string, batchSize: number, id, condition): Observable<any> {

    const source = this.deleteBatch(path, batchSize, id, condition)

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize, id, condition)),
      takeWhile(val => val > 0)
   )

  }


  // Detetes documents as batched transaction
  private deleteBatch(path: string, batchSize: number, id, condition): Observable<any> {
    const colRef = this._afs.collection(path, ref => ref.where(condition, '==', id).limit(batchSize) )

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap(snapshot => {

        // Delete documents in a batch
        const batch = this._afs.firestore.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.payload.doc.ref);
        });

        return fromPromise( batch.commit() ).map(() => snapshot.length)

      })
    )
}


getItemVotes(replyId) {
  return this._afs.doc(`o-t-forum-replies-upvotes/${replyId}`).valueChanges();
}

updateUserVote(replyId, userId, vote): void {
  const data = {}
  data[userId] = vote;
  this._afs.doc(`o-t-forum-replies-upvotes/${replyId}`).set(data, {merge: true});
}
}
