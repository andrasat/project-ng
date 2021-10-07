import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";

import { environment } from "@environments/environment";
import {
  AuthService,
  QSApiService
} from "./services";

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [
    QSApiService,
    AuthService
  ]
})
export class CoreModule {}
