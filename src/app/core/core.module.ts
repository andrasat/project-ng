import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";

import { environment } from "@environments/environment";
import {
  AuthService,
  QSApiService,
  StorageService
} from "./services";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [
    QSApiService,
    AuthService,
    StorageService,
  ]
})
export class CoreModule {}
