
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import { fromPromise } from 'rxjs/observable/fromPromise';
import * as firebase from 'firebase';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$
    .ofType(AuthActions.TRY_SIGNUP)
    .map((action: AuthActions.TrySignup) => {
      return action.payload;
    })
    .switchMap((authData: {username: string, password: string}) => {
      return fromPromise(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));
    })
    .switchMap(() => {
      return fromPromise(firebase.auth().currentUser.getIdToken());
    })
    .mergeMap((token: string) => {
      return [
        {
          type: AuthActions.SIGNUP
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ];
    });

  @Effect()
  authSignin = this.actions$
    .ofType(AuthActions.TRY_SIGNIN)
    .map((action: AuthActions.TrySignup) => {
      return action.payload;
    })
    .switchMap((authData: {username: string, password: string}) => {
      return fromPromise(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password));
    })
    .switchMap(() => {
      return fromPromise(firebase.auth().currentUser.getIdToken());
    })
    .mergeMap((token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthActions.SIGNIN
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ];
    });

  @Effect({dispatch: false})
  authLogout = this.actions$
    .ofType(AuthActions.LOGOUT)
    .do(() => {
      this.router.navigate(['/']);
    });

  constructor(private actions$: Actions, private router: Router) {
  }
}

/*import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { User } from './auth.model';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import * as userActions from './auth.actions';
export type Action = userActions.All;
@Injectable()
export class UserEffects {
    constructor(private actions: Actions, private afAuth: AngularFireAuth) {}
    @Effect()
   getUser:  Observable<Action> = this.actions.ofType(userActions.GET_USER)
       .map((action: userActions.GetUser) => action.payload )
       .switchMap(payload => this.afAuth.authState )
       .delay(2000) // delay to show loading spinner, delete me!
       .map( authData => {
           if (authData) {
               /// User logged in
               const user = new User(authData.uid, authData.displayName);
               return new userActions.Authenticated(user);
           } else {
               /// User not logged in
               return new userActions.NotAuthenticated();
           }
       })
       .catch(err =>  Observable.of(new userActions.AuthError()) );

    @Effect()
       login:  Observable<Action> = this.actions.ofType(userActions.GOOGLE_LOGIN)
           .map((action: userActions.GoogleLogin) => action.payload)
           .switchMap(payload => {
               return Observable.fromPromise( this.googleLogin() );
           })
           .map( credential => {
               // successful login
               return new userActions.GetUser();
           })
           .catch(err => {
               return Observable.of(new userActions.AuthError({error: err.message}));
           });

    @Effect()
    logout:  Observable<Action> = this.actions.ofType(userActions.LOGOUT)
        .map((action: userActions.Logout) => action.payload )
        .switchMap(payload => {
            return Observable.of( this.afAuth.auth.signOut() );
        })
        .map( authData => {
            return new userActions.NotAuthenticated();
        })
        .catch(err => Observable.of(new userActions.AuthError({error: err.message})) );

    private googleLogin() {
          const provider = new firebase.auth.GoogleAuthProvider();
          return this.afAuth.auth.signInWithPopup(provider);
    }
}*/
