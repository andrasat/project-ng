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
    config.interval = 5000;
  }

  branchList: IBranchList | undefined
  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnInit() {
    this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
  }
}