import { Injectable } from "@angular/core";
import { NotifyService } from "@shared/services/notify.service";
import { SpinnerService } from "@shared/services/spinner.service";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Collection } from "@collections/state/collections.model";
import { Observable } from "rxjs/Observable";
import { Page } from "@collections/state/page.model";
@Injectable()
export class CollectionsService {
  collections = [
    {
      title: 'Blogs',
      color: 'gray',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      createdAt: '2 June 1987'
    },
    {
      title: 'Angular',
      color: 'orange',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://christianliebel.com/wp-content/uploads/2016/02/Angular2-825x510.png',
      createdAt: '2 June 1987'
    },
    {
      title: 'Shitholes',
      color: 'silver',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      createdAt: '2 June 1987'
    },
    {
      title: 'Economy',
      color: 'indigo',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987'
    },
    {
      title: 'ReactJs',
      color: 'teal',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987'
    },
    {
      title: 'Wordpress',
      color: 'cyan',
      photoURL: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      description: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog',
      creator: 'Oj Obasi',
      createdAt: '2 June 1987'
    }

  ];

  constructor (
    private _notify: NotifyService,
    private _spinner: SpinnerService,
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
  ) {}

  getAllCollections (): Observable<Collection[]> {
    const ref: AngularFirestoreCollection<Collection> = this._afs.collection(`o-t-collections`);
    return ref.valueChanges();
  }

  getCollection(key): Observable<Collection | null> {
    const item = this._afs.doc(`o-t-collections/${key}`).valueChanges() as Observable<Collection | null>;
    return item;
  }


  addcollection(collection) {
    const ref = this._afs.collection<any>('o-t-collections').doc(collection.$key);
    ref.set(Object.assign({}, collection))
    .then(() => {
      this._notify.update('<strong>Collection Added!</strong> Collection Successfully Added. You will be redirected!', 'info');
    }).catch((error) => {
      this._notify.update(error.message, 'error');
    });
    setTimeout(() => {
      this._spinner.hideAll();
    }, 2000);
  }


  addPage(page: Page) {
   const ref = this._afs.collection<any>(page.collection).doc(`${page.component}/${page.component}/${page.$key}`);
   return ref.set(Object.assign({}, page))
     .then(() => {
      return this._notify
       .update('<strong>Page Added!</strong> Page Successfully Added. It May Require Review! You will be redirected!', 'info');
     }).then(() => {
        setTimeout(() => {
          this._spinner.hideAll();
        }, 2000);
     }).catch((error) => {
      this._notify.update(error.message, 'error');
      this._spinner.hideAll();
      return 'error';
     });
  }

  addDraft(page: Page) {
    const ref = this._afs.collection<any>(page.collection).doc(`${page.component}/${page.component}/${page.$key}`);
    return ref.set(Object.assign({}, page))
      .then(() => {
       return this._notify
       .update('<strong>DRAFT!</strong> Your Draft Has Been Saved!', 'info');
      }).then(() => {
         setTimeout(() => {
           this._spinner.hideAll();
         }, 2000);
      }).catch((error) => {
       this._notify.update(error.message, 'error');
       this._spinner.hideAll();
       return 'error';
      });
  }

  getPage(collection, component, key): Observable<Page | null> {
    const item = this._afs.doc(`${collection}/${component}/${component}/${key}`).valueChanges() as Observable<Page | null>;
    return item;
  }

  getCollectionPages ($key, collection): Observable<{}[]> {
    const item = this._afs.collection(`${collection}/pages/pages`,
    (ref) => ref.where('collectionKey', '==', $key).orderBy('updatedAt', 'desc'));
    return item.valueChanges();
  }

  editcollection(collection) {
    const ref = this._afs.collection<any>('o-t-collections').doc(collection.$key);
    ref.update(Object.assign({}, collection))
    .then(() => {
      this._notify.update('<strong>Collection Updated!</strong> Collection Successfully Updated. You will be redirected!', 'info');
    }).catch((error) => {
      this._notify.update(error.message, 'error');
    });
    setTimeout(() => {
      this._spinner.hideAll();
    }, 2000);

  }

  updateDraft(page: Page) {
    const item = this._afs.doc(`${page.collection}/${page.component}/${page.component}/${page.$key}`)
    return item.update(Object.assign({}, page))
      .then(() => {
       return this._notify
       .update('<strong>DRAFT!</strong> Your Draft Has Been Updated!', 'info');
      }).then(() => {
         setTimeout(() => {
           this._spinner.hideAll();
         }, 2000);
      }).catch((error) => {
       this._notify.update(error.message, 'error');
       this._spinner.hideAll();
       return 'error';
      });
  }

  updatePage(page: Page){
    const item = this._afs.doc(`${page.collection}/${page.component}/${page.component}/${page.$key}`)
   return item.update(Object.assign({}, page))
   .then(() => {
    return this._notify
    .update('<strong>Update Added!</strong> Page Successfully Updated. It May Require Review! You will be redirected!', 'info');
   }).then(() => {
      setTimeout(() => {
        this._spinner.hideAll();
      }, 2000);
   }).catch((error) => {
    this._notify.update(error.message, 'error');
    this._spinner.hideAll();
    return 'error';
   });
  }
}
