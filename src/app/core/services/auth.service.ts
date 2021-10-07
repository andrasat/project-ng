import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable()
export class AuthService {
  constructor(
    public firebaseAuth: AngularFireAuth
  ) {}

  signInGoogle() {
    return this.firebaseAuth.signInWithPopup(new GoogleAuthProvider());
  }
}