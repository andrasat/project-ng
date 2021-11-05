import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public locationService: LocationService,
    public qsApiService: QSApiService,
  ) {}

  private unsubscribe$ = new Subject<void>()

  branchList: IBranchList | undefined
  hideBottomNav = false

  ngOnInit() {
    if (this.router.url.includes('payment-confirmation')) {
      this.hideBottomNav = true;
    }

    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => {
        this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchList => this.branchList = branchList);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}