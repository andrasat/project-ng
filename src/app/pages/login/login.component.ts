import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService, LocationService, QSApiService } from '@core/services';
import { IBranchList } from "@core/models";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public locationService: LocationService,
    public router: Router,
    public authService: AuthService,
    public qsApiService: QSApiService
  ) {}

  branchList: IBranchList | undefined

  ngOnInit() {
    this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
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

    this.router.navigate([`/${this.branchList?.companyCode}`]);
  }
}