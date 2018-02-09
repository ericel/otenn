import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService} from './auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { NotifyService } from '@services/notify.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.auth.user
           .take(1)
           .map(user => !!user)
           .do(loggedIn => {
             if (!loggedIn) {
               this.notify.update('<strong>Access Denied!</strong> You must be logged in!', 'error');
               this.router.navigate(['/login']);
             }
         })
  }

}

