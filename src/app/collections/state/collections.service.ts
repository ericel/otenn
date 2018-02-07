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
  collections = [
    {
      title: 'Blogs',
      color: 'gray',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      createdAt: '2 June 1987',
      $key: 'ue82942j'
    },
    {
      title: 'Angular',
      color: 'orange',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://christianliebel.com/wp-content/uploads/2016/02/Angular2-825x510.png',
      createdAt: '2 June 1987',
      $key: 'ue82942r'
    },
    {
      title: 'Shitholes',
      color: 'silver',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      createdAt: '2 June 1987',
      $key: 'te82942j'
    },
    {
      title: 'Economy',
      color: 'indigo',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987',
      $key: 'me82942j'
    },
    {
      title: 'ReactJs',
      color: 'teal',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987',
      $key: 'we82942j'
    },
    {
      title: 'Wordpress',
      color: 'cyan',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987',
      $key: '3e82942j'
    }

  ];

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


  getCommentCount(id) {
    return this._afs.collection('o-t-pages-comments', ref => ref.where('pageId', '==', id) )
    .valueChanges();
  }


  deleteCollection(path: string, batchSize: number, id): Observable<any> {

    const source = this.deleteBatch(path, batchSize, id)

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize, id)),
      takeWhile(val => val > 0)
   )

  }


  // Detetes documents as batched transaction
  private deleteBatch(path: string, batchSize: number, id): Observable<any> {
    const colRef = this._afs.collection(path, ref => ref.where('pageId', '==', id).limit(batchSize) )

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
}
