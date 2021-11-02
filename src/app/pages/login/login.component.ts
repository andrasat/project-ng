import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService, LocationService, QSApiService } from '@core/services';
import { IBranchList } from "@core/models";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    public locationService: LocationService,
    public router: Router,
    public authService: AuthService,
    public qsApiService: QSApiService
  ) {}

  branchList: IBranchList | undefined
  observer: Subscription | undefined

  ngOnInit() {
    this.observer = this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
  }

  ngOnDestroy() {
    this.observer?.unsubscribe();
  }

  async loginHandler(type: string = 'default') {
    switch(type) {
      case 'google':
        await this.authService.signInGoogle();
        break;
      case 'facebook':
        await this.authService.signInFacebook();
        break;
      default:
        this.authService.signInWithoutProvider();
    }

    this.router.navigate([`/${this.branchList?.companyCode}/home`]);
  }
}