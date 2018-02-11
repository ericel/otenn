import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { NotifyService } from '@services/notify.service';

import { AngularFirestore } from 'angularfire2/firestore';
import { Local } from 'app/auth/state/user.model';
@Injectable()
export class LocationService {

  constructor(
    private _http: Http,
    private notify: NotifyService,
    private afs: AngularFirestore,
  ) { }
  getCurrentIpLocation(): Observable<any> {
    return this._http.get('https://ipinfo.io')
    .map(response => response.json())
    .catch(error => {
        console.log(error);
        this.notify.update(error, 'error')
        return Observable.throw(error.json());
    });
}

 // Return a single observable User
getUserLocal(id: string) {
  const ref =  this.afs.doc<Local>(`o-t-users-local/${id}`);
  return ref.valueChanges();
}
}
