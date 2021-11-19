import { Component, OnDestroy, OnInit } from "@angular/core";

import { AuthService, LocationService, NavigationService, QSApiService } from '@core/services';
import { IBranchList } from "@core/models";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    public locationService: LocationService,
    public navigation: NavigationService,
    public authService: AuthService,
    public qsApiService: QSApiService
  ) {}

  private unsubscribe$ = new Subject<void>()

  branchList: IBranchList | undefined

  ngOnInit() {
    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => {
        this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList  
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchList => this.branchList = branchList);

    this.authService.isLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoggedIn => {
        if (isLoggedIn) this.navigation.navigate(`${this.branchList?.companyCode}`);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        this.navigation.navigate(`/${this.branchList?.companyCode}`);
    }
  }
}