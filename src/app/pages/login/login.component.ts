import { Component, Inject, OnInit } from "@angular/core";
import { GeolocationService, GEOLOCATION_SUPPORT } from "@ng-web-apis/geolocation";
import { throwError } from 'rxjs';

import { AuthService, QSApiService } from '@core/services';
import { IBranchList } from "@core/models";
import { take, catchError } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    @Inject(GEOLOCATION_SUPPORT) private readonly geolocationSupport: boolean,
    private readonly geolocation: GeolocationService,
    public authService: AuthService,
    public qsApiService: QSApiService
  ) {}

  branchList: IBranchList

  private insertDefaultLocation = (error: any) => {

    this.qsApiService.getBranchList()
      .subscribe(branchList => this.branchList = branchList);

    return throwError(error);
  }

  ngOnInit() {
    if (this.geolocationSupport) {

      this.geolocation
        .pipe(catchError(this.insertDefaultLocation))
        .pipe(take(1))
        .subscribe(position => {
          this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude)
            .subscribe(branchList => this.branchList = branchList);
        });

    } else {

      this.qsApiService.getBranchList()
        .subscribe(branchList => this.branchList = branchList);

    }
  }
}