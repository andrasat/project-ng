import { Component, OnInit } from '@angular/core';
import { IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';

@Component({
  selector: 'app-company-home',
  templateUrl: 'company-home.component.html'
})
export class CompanyHomeComponent implements OnInit {
  constructor(
    public qsApiService: QSApiService,
    public locationService: LocationService,
  ) { }

  branchList: IBranchList | undefined
  images = []

  ngOnInit() {
    this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
  }
}