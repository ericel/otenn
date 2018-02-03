import { Injectable, Inject } from '@angular/core';
import { Upload } from './upload.model';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { NotifyService } from '@shared/services/notify.service';

import { Store } from '@ngrx/store';
import * as actions from '@collections/state/actions/collection.actions';
import * as fromCollection from '@collections/state/reducers/collection.reducer';
@Injectable()
export class UploadService {
  basePath = 'o-users-uploads';
  uploadsRef: AngularFirestoreCollection<Upload>;
  uploads: Observable<Upload[]>;
  storageRef;
  downLURL;
  constructor(
    private notify: NotifyService,
    private afs: AngularFirestore,
    private fb: FirebaseApp,
    private _notify: NotifyService,
    private store: Store<fromCollection.State>
  ) {
    this.storageRef = this.fb.storage().ref();
  }

  getUploadsById(id: string) {
      const ref =  this.afs.doc<Upload>(`wi-users-uploads/${id}`);
      return ref.valueChanges();
  }

  deleteUpload(upload: Upload) {
    /*this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name);
    })
    .catch((error) => console.log(error));
    */
  }


  pushUpload(uid, upload: Upload, name, path, firestoreUrl) {
    const uploadTask = this.storageRef.child(`${this.basePath}/${uid}/${path}/${name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) =>  {
        // upload in progress
        const snap = snapshot;
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (error) => {
        // upload failed
        this.handleError(error)
      },
      () => {
        // upload success
        if (uploadTask.snapshot.downloadURL && uploadTask.snapshot.state==='success') {
          upload.url = uploadTask.snapshot.downloadURL;
          upload.name = upload.file.name;
           this.updateFirestore(uid, upload, firestoreUrl);
          return upload.url;
        } else {
          this._notify.update('<strong>No download URL!!</strong> upload again.', 'error')
        }
      },
    );
  }

private updateFirestore(uid, upload, firestoreUrl) {
  const Ref: AngularFirestoreDocument<any> = this.afs.doc(`${firestoreUrl}`);
  return Ref.update({photoURL: upload.url});
}



  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
     // If error, console log and notify user
  private handleError(error) {
      this._notify.update(error.message, 'error')
 }
}
