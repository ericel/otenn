import { Component,
  OnInit,
   OnDestroy,
    ChangeDetectorRef,
     Input, ViewChild,
      Output,
       EventEmitter,
       Inject,
       HostListener,
       Renderer2,
       ElementRef
 } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatMenuTrigger, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '@shared/services/spinner.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { User } from './../../../auth/state/auth.model';
import * as userActions from './../../../auth/state/auth.actions';
import * as fromApp from './../../../reducers';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ MediaMatcher]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() mobilequery: boolean;
  @Output() toggleDrawer = new EventEmitter<void>();
  @ViewChild('userMenu') trigger: MatMenuTrigger;
  @ViewChild('collectionMenu') trigger_collections: MatMenuTrigger;
  @ViewChild('collections') collections: ElementRef;
  mobileQuery: MediaQueryList;
  searchOpen: boolean = false;
  auth = false;
  user$: Observable<User>;
    mobileQue: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private media: MediaMatcher,
      private _dailog: MatDialog,
      private renderer: Renderer2,
      private store: Store<fromApp.AppState>
      ) {
    }

    ngOnInit() {
      this.user$ = this.store.select('auth');
      this.store.dispatch(new userActions.GetUser());
    }

    ngOnDestroy() {

    }

    showmenu() {
      this.trigger.openMenu();
      return false;
    }

    /*@HostListener('mouseenter') mouseenter(data: Event) {
      this.trigger_collections.openMenu();
    }*/
    onCollectionsIn() {
      this.trigger_collections.openMenu();
      this.trigger.closeMenu();
      return;
    }
    /*
    onCollectionsOut() {
      console.log('out')
      setTimeout(() => {
        this.trigger_collections.closeMenu();
      }, 200);
    }*/
    onSearch() {
      this.searchOpen = !this.searchOpen;
    }

    onCloseSearch() {
      this.searchOpen = !this.searchOpen;
    }

    onToggle() {
      this.toggleDrawer.emit();
    }

    onLogin() {
        this._dailog.open(SignupDialog, {
          data: {
            uid: 'this._auth.uid',
            bio: 'this._auth.bio'
          }
        });
    }
}

@Component({
  selector: 'signup-dailog',
  template: `<login-card (closeDailog)="onClose()"></login-card>`

})
export class SignupDialog implements OnInit {

  Onload: boolean = false;
  constructor(public dialogRef: MatDialogRef<SignupDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
  public _spinner: SpinnerService
  ) {

  }

  ngOnInit() {
   setTimeout(() => {
     this.Onload = !this.Onload;
   }, 2000);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  OnSpinner() {
    this._spinner.show('appSpinner');
  }
}

@Component({
  selector: 'login-card',
  templateUrl: './signup.component.html',
  styleUrls: ['./header.component.css']
})
export class LoginCard implements OnInit {
  @Output() closeDailog = new EventEmitter<void>();
  Onload: boolean = false;
  user$: Observable<User>;
  constructor(
  public _spinner: SpinnerService,
  private store: Store<fromApp.AppState>
  ) {

  }

  ngOnInit() {
   setTimeout(() => {
     this.Onload = !this.Onload;
   }, 2000);

   this.user$ = this.store.select('auth');
   this.store.dispatch(new userActions.GetUser());
  }

  googleLogin() {
    this.store.dispatch(new userActions.GoogleLogin());
  }

  facebookLogin() {
    console.log('facebook')
  }
  logout() {
   //
  }
  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    //this.store.dispatch(new authActions.TrySignup({username: email, password: password}));
  }

  onLogin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
   // this.store.dispatch(new authActions.TrySignin({username: email, password: password}));
  }
  OnSpinner() {
    this._spinner.show('appSpinner');
  }
  onClose(): void {
    this.closeDailog.emit();
  }
}
