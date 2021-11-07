import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { AuthService } from '.';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  
  canActivate() {
    return this.auth.isLoggedIn.pipe(map(isLoggedIn => {
      if (isLoggedIn) return isLoggedIn;

      return this.router.parseUrl('/login');
    }));
  }
}