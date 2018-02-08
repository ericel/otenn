
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

import * as authActions from './auth.actions';
import { NotifyService } from '@shared/services/notify.service';
import { User } from 'app/auth/state/auth.model';

@Injectable()
export class AuthEffects {
  @Effect()
  getUser:  Observable<Action> = this.actions$.ofType(authActions.GET_USER)
      .map((action: authActions.GetUser) => action.payload )
      .switchMap(payload => this._afAuth.authState )
      .delay(2000) // delay to show loading spinner, delete me!
      .map( authData => {
          if (authData) {
              /// User logged in
              const user = new User(authData.uid, authData.displayName);
              return new authActions.Authenticated(user);
          } else {
              /// User not logged in
              return new authActions.NotAuthenticated();
          }
      })
      .catch(err =>  Observable.of(new authActions.AuthError()) );

  @Effect()
  login:  Observable<Action> = this.actions$.ofType(authActions.GOOGLE_LOGIN)
      .map((action: authActions.GoogleLogin) => action.payload)
      .mergeMap(payload => {
          return Observable.fromPromise( this.googleLogin() )

      .map( credential => {
         console.log(credential);
          // successful login
          return new authActions.GetUser();
      })
      .catch(err => {
        this._notify.update(err.message, 'error');
        return Observable.of(new authActions.Fail({error: err.message}));
         // return Observable.of(new AuthActions.AuthError({error: err.message}));
      });
    });

    @Effect()
    logout:  Observable<Action> = this.actions$.ofType(authActions.LOGOUT)
        .map((action: authActions.Logout) => action.payload )
        .mergeMap(payload => {
            return Observable.of( this._afAuth.auth.signOut() )
        .map( authData => {
              return new authActions.NotAuthenticated();
          })
          .catch(err => Observable.of(new authActions.AuthError({error: err.message})) );
     });

  /*@Effect()
  authSignup = this.actions$
    .ofType(authActions.TRY_SIGNUP)
    .map((action: authActions.TrySignup) => {
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
      return fromPromise(firebase.auth().currentUser.getIdToken())
      .map((token: string) =>  {
        //this._router.navigate(['../collections/c'], {relativeTo: this._route});
        //return new actions.Success();
        return [
          {
            type: AuthActions.SIGNIN
          },
          {
            type: AuthActions.SET_TOKEN,
            payload: token
          }
        ]
      })
      .catch(err => {
       this._notify.update(err.message, 'error');
       console.log(err.message)
       return Observable.of(new AuthActions.Fail(err.message))
      });
    });

   /* .mergeMap((token: string) => {
      this.router.navigate(['/']);
      return  fromPromise([
        {
          type: AuthActions.SIGNIN
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ])
      .map(() =>  {
        //this._router.navigate(['../collections/c'], {relativeTo: this._route});
        //return new actions.Success();
      })
      .catch(err => Observable.of(new actions.Fail(err.message)));
    });*/

  @Effect({dispatch: false})
  authLogout = this.actions$
    .ofType(authActions.LOGOUT)
    .do(() => {
      this.router.navigate(['/']);
    });
    private googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      return this._afAuth.auth.signInWithPopup(provider);
   }
  constructor(private actions$: Actions,
     private router: Router,
     private _afAuth: AngularFireAuth,
     private _notify: NotifyService
    ) {}
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
