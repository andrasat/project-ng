import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IUserData } from "@core/models";
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from "./storage.service";
import { QSApiService } from "./qs-api.service";

@Injectable()
export class AuthService {
  constructor(
    public firebaseAuth: AngularFireAuth,
    public qsApiService: QSApiService,
    public storageService: StorageService,
  ) {

    const userData = this.storageService.getItem('user');

    if (userData) this._isLoggedInSubject.next(true);

    firebaseAuth.authState.subscribe(user => {
      if (user) {
        qsApiService.saveAuth({
          email: user.email!,
          fullName: user.displayName!,
          phoneNumber: user.phoneNumber,
          imageUrl: user.photoURL,
        }).subscribe(
          userData => {
            const [userProviderData] = user.providerData;

            storageService.setItem('user', JSON.stringify({
              email: userData.email!,
              fullName: userData.fullName!,
              phoneNumber: userData.phoneNumber,
              imageUrl: userData.imageUrl,
              token: userData.token,
              loginVia: userProviderData ? userProviderData.providerId.replace('.com', '') : null,
            } as IUserData));
            this._isLoggedInSubject.next(true);
          }
        );
      }
    });
  }

  private _isLoggedInSubject = new BehaviorSubject<boolean>(false)
  isLoggedIn = this._isLoggedInSubject.asObservable()

  signInGoogle() {
    return this.firebaseAuth.signInWithRedirect(new GoogleAuthProvider());
  }

  signInFacebook() {
    return this.firebaseAuth.signInWithRedirect(new FacebookAuthProvider());
  }

  signInWithoutProvider() {
    const userData: IUserData = {
      email: '',
      fullName: 'As Guest',
      phoneNumber: '',
      imageUrl: '',
      token: '',
      loginVia: null,
    };

    this.storageService.setItem('user', JSON.stringify(userData));
    this._isLoggedInSubject.next(true);
    return;
  }

  async signOut() {
    await this.firebaseAuth.signOut();
    this.storageService.removeItem('user');
    this._isLoggedInSubject.next(false);
    return;
  }
}