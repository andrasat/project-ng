import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { IAddress, IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';
import { separateAddress } from '@utils/separateAddress';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-company-home',
  templateUrl: 'company-home.component.html',
  styleUrls: ['./company-home.component.scss'],
  providers: [NgbCarouselConfig],
})
export class CompanyHomeComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public locationService: LocationService,
    public config: NgbCarouselConfig,
  ) {
    config.interval = 5000;
  }

  branchList: IBranchList | undefined
  currentAddress: IAddress | undefined 
  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnInit() {
    this.locationService.currentPosition
      .pipe(take(1))
      .subscribe(position => {
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList.subscribe(branchList => {
      this.branchList = branchList;
      console.log('branchList: ', branchList);
    });
    this.qsApiService.currentAddress.subscribe(address => this.currentAddress = address);
  }

  goToLocation() {
    this.router.navigate(['/location'], { queryParams: { companyCode: this.branchList?.companyCode } });
  }
}