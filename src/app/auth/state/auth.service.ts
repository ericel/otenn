import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import { NotifyService } from '@services/notify.service';
import { User, Local } from './user.model';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { SpinnerService } from '@services/spinner.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { LocationService } from '@services/location.service';
@Injectable()
export class AuthService {
  user: Observable<User | null>;
  getAuthId;
  users: AngularFirestoreCollection<User>;
  userId: string; // current user uid
  private sub: Subscription;
  userRef: AngularFirestoreDocument<User>;
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService,
              private spinner: SpinnerService,
              private location: Location,
              private _locationService: LocationService
            ) {
//// Get auth data, then get firestore user document || null
  this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            this.userRef = this.afs.doc(`o-t-users/${user.uid}`)
            this.userId = user.uid;
            return this.afs.doc<User>(`o-t-users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })
     this.users = this.afs.collection('o-t-users', (ref) => ref.orderBy('updatedAt', 'desc'));
  }

  getUser(id: string) {
      const ref =  this.afs.doc<User>(`o-t-users/${id}`);
      return ref.valueChanges();
  }

  getSnapshot(): Observable<User[]> {
    return this.users.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  private updateStatus(status: string) {
    if (!this.userId) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`o-t-users/${this.userId}`);
    const data = {
      status: status
    }
    return userRef.update(data)
  }
}

//Update page View TODO: STILL TO TODO
userpageView(uid, view){
    const viewcount = view + 1;
    const data = {
      view: viewcount
    }
   return this.afs.doc(`o-t-users/${uid}`).update(data);
}

private updateUserData(user) {
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`o-t-users/${user.uid}`);
  userRef.valueChanges().subscribe(res=>{
    if(res){
      const data = {
        updatedAt: this.getCurrentTime(),
        status: 'online'
      }
      return userRef.update(data);
    } else {
      const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: {
          fullname: user.displayName || user.email.split('@')[0],
          editCount:0,
          username: user.displayName || user.email.split('@')[0]
        },
        photoURL: user.photoURL || 'https://wilde-beests.firebaseapp.com/assets/img/avatar.png',
        createdAt: this.getCurrentTime(),
        updatedAt: this.getCurrentTime(),
        view: 0,
        roles: {user: true,dealer: false,admin: false},
        verified: {
          links:{facebook: 'Enter your facebook profile url',
          twitter: 'Enter your twitter profile url',
          email: user.email || 'Enter your email address',
          phone: 'Enter your phone number'
          },
          facebook: false,
          twitter: false,
          email: true,
          phone: false
        },
        status: 'online',
        bio: '<strong>PROFILE NEEDS EDITING!<strong><br>I\'m an Otenn Robot! More about me to be added. <p class="text-danger">Incomplete profile! Profile needs more information.</p>I\'m an Otenn Robot! More about me to be added. <p class="text-danger">Incomplete profile! Profile needs more information.</p>',
      }
      this._Local_User(user);
      return userRef.set(data, {merge: true}).then(() =>
        this.update_localto_user(user)
      ).catch((error) => this.handleError(error) );

    }
  }).unsubscribe;
   this.spinner.hideAll();
   this.back();
 }

private update_localto_user(user){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`o-t-users/${user.uid}`);
    const locale = this._locationService.getCurrentIpLocation().subscribe((local) => {
      const data = {
        contactInfo: {
          country: local.country || 'Country needed!',
          city: local.city || 'City needed!',
          region: local.region || 'State, Province needed!',
          lat_long: local.loc || 'Latitude and Longitude needed!',
          internetOrg: local.org
        }
      }
    return userRef.update(data).then(() => {
      }).catch((error) => this.handleError(error) );
  }).unsubscribe;
}

private _Local_User(user){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`o-t-users-local/${user.uid}`);
    const locale = this._locationService.getCurrentIpLocation().subscribe(local => {
      const data: Local = {
        uid: user.uid,
        country: local.country || 'Country needed!',
        city: local.city || 'City needed!',
        ip: local.ip || 'Location Ip needed!',
        region: local.region || 'State, Province needed!',
        lat_long: local.loc || 'Latitude and Longitude needed!',
        internetOrg: local.org
      }
    return userRef.set(data, {merge: true}).then(() => {

      }).catch((error) => this.handleError(error) );
  }).unsubscribe;
}


/******************* AUTHENTICATION METHODS *****************
 * *****************TODO: TWITTER AUTH **********************
*/
googleLogin() {
  this.spinner.show('mySpinnerg');
  const provider = new firebase.auth.GoogleAuthProvider()
  return this.oAuthLogin(provider);
}

facebookLogin() {
  this.spinner.show('mySpinnerf');
  const provider = new firebase.auth.FacebookAuthProvider()
  return this.oAuthLogin(provider);
}

emailSignUp(email: string, password: string) {
  this.spinner.show('mySpinners');
  return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      this.notify.update('Welcome to Firestarter!!!', 'success');
      return this.updateUserData(user); // if using firestore
    })
    .catch((error) => this.handleError(error) );
}

emailLogin(email: string, password: string) {
  this.spinner.show('mySpinnerl');
  return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      this.notify.update('Welcome to Firestarter!!!', 'success')
      return this.updateUserData(user); // if using firestore
    })
    .catch((error) => this.handleError(error) );
}


resetPassword(email: string) {
  const fbAuth = firebase.auth();

  return fbAuth.sendPasswordResetEmail(email)
    .then(() => this.notify.update('Password update email sent', 'info'))
    .catch((error) => this.handleError(error));
}

/*******************END AUTHENTICATION METHODS *****************
* *****************TODO: TWITTER AUTH **********************
*/


signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.back();
    });
}

///// Role-based Authorization //////
canRead(user: User): boolean {
    const allowed = ['admin', 'dealer', 'user']
    return this.checkAuthorization(user, allowed)
}

canEdit(user: User): boolean {
    const allowed = ['admin', 'dealer']
    return this.checkAuthorization(user, allowed)
}

canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
}


private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {return false;}
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
}



//Update user data
updateBio(bio){
    const data = {
      updatedAt: this.getCurrentTime(),
      bio: bio
    }
  return this.userRef.update(data).then(() => {
      this.notify.update("<strong>User Saved!</strong> Way to go.", 'info')
  }).catch((error) => this.handleError(error) );

}

updateContactInfo(uid, address, city, country){
      const data = {
        updatedAt: this.getCurrentTime(),
        contactInfo: {
          region: address,
          city: city,
          country: country
        }
      }
      return this.userRef.update(data).then(() => {
      this.notify.update("<strong>User Saved!</strong> Way to go.", 'info')
    }).catch((error) => this.handleError(error) );
}

updateVerifiedLinks(uid, facebook, twitter, email, phone){
  if (/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(facebook)){
     var verifyFacebook = true;
  } else {
    var verifyFacebook = false;
  }
  if (/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(#!\/)?[a-zA-Z0-9_]+$/i.test(twitter)){
    var verifyTwitter = true;
 } else {
  var verifyTwitter = false;
 }
    const data = {
      email: email,
      updatedAt: this.getCurrentTime(),
      "verified.links.facebook": facebook,
      "verified.links.twitter": twitter,
      "verified.links.email": email,
      "verified.links.phone": phone,
      "verified.facebook": verifyFacebook,
      "verified.twitter": verifyTwitter
    }
    return this.userRef.update(data).then(() => {
    this.notify.update("<strong>Social Links Saved!</strong> Way to go.", 'info')
    }).catch((error) => this.handleError(error) );
}

updateUsername(uid, username, fullname, count){
  if (count > 0){
    this.notify.update("<strong>This property can't be change anymore!</strong> Sorry.", 'error')
    return
  }
    const data = {
      displayName: {
        fullname: fullname,
        editCount:1,
        username: username
      },
      updatedAt: this.getCurrentTime()
    }
    return this.userRef.update(data).then(() => {
    this.notify.update("<strong>Account Name Set!</strong> Way to go.", 'info')
    }).catch((error) => this.handleError(error) );
}

private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.notify.update('Welcome to Otenn!!!', 'success');
        this.updateUserData(credential.user)
      })
      .catch((error) => this.handleError(error) );
}

back() {
 if (window.history.length > 2) {
        this.location.back();
    } else {
        this.router.navigate(['/']);
  }
}
getCurrentTime(){
  return moment().format("YYYY-MM-DD HH:mm:ss");
}
private handleError(error) {
    this.notify.update(error.message, 'error')
}

}
