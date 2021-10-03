import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loginForm: FormGroup
  socialUser: SocialUser
  isLoggedin: boolean

  constructor(
    private formBuilder: FormBuilder, 
    private socialAuthService: SocialAuthService
  ) {
    this.isLoggedin = false;
  }

  ngOnInit() {
    console.log('INIT !');
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    console.log('this.isLoggedIn: ', this.isLoggedin);
    console.log('this.socialAuthService: ', this.socialAuthService.authState);
    this.socialAuthService.authState.subscribe((user) => {
      console.log('user: ', user);
      this.socialUser = user;
      this.isLoggedin = (user != null);
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
}
