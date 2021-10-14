import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IUserDataInput } from "@core/models";
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

import { StorageService } from "./storage.service";
import { QSApiService } from "./qs-api.service";

@Injectable()
export class AuthService {
  constructor(
    public router: Router,
    public firebaseAuth: AngularFireAuth,
    public qsApiService: QSApiService,
    public storageService: StorageService
  ) {
    firebaseAuth.authState.subscribe(user => {
      if (user) {
        const userData: IUserDataInput = { 
          email: user.email!,
          fullName: user.displayName!,
          phoneNumber: user.phoneNumber,
          imageUrl: user.photoURL,
        };
        storageService.setItem('userLogin', JSON.stringify(userData));
      } else {
        storageService.removeItem('userLogin');
      }
    });
  }

  isLoggedIn: boolean = false

  signInGoogle() {
    return this.firebaseAuth.signInWithRedirect(new GoogleAuthProvider());
  }

  signInFacebook() {
    return this.firebaseAuth.signInWithRedirect(new FacebookAuthProvider());
  }

  signInWithoutProvider() {
    const userData: IUserDataInput = {
      email: '',
      fullName: 'As Guest',
      phoneNumber: '',
      imageUrl: '',
    };

    this.storageService.setItem('userLogin', JSON.stringify(userData));

    return;
  }

  async signOut() {
    await this.firebaseAuth.signOut();
    this.storageService.removeItem('userLogin');
    return;
  }
}