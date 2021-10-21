import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';

@Component({
  selector: 'app-company-home',
  templateUrl: 'company-home.component.html',
  styleUrls: ['./company-home.component.scss'],
  providers: [NgbCarouselConfig],
})
export class CompanyHomeComponent implements OnInit {
  constructor(
    public qsApiService: QSApiService,
    public locationService: LocationService,
    public config: NgbCarouselConfig,
  ) {
  }

  branchList: IBranchList | undefined
  images = [
    'assets/image/placeholder-landing-group.jpg'
  ]

  ngOnInit() {
    this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
  }
}