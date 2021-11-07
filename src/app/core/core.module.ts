import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";

import { environment } from "@environments/environment";
import {
  AuthService,
  QSApiService,
  StorageService,
  LocationService,
  NavigationService,
  AuthGuardService,
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
    LocationService,
    NavigationService,
    AuthGuardService,
    {
      provide: APP_INITIALIZER,
      useFactory: (locationService: LocationService) => () => locationService.getInitialPosition(),
      deps: [LocationService],
      multi: true,
    }
  ]
})
export class CoreModule {}
