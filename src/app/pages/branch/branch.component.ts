import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
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
    public route: ActivatedRoute,
    public router: Router,
    public locationService: LocationService,
    public qsApiService: QSApiService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  private unsubscribe$ = new Subject<void>()

  branchList: IBranchList | undefined
  hideBottomNav = false
  activeRoute: 'home' | 'promo' | 'history' | 'others' = 'home'

  params: any = {}

  ngOnInit() {
    this.setActiveRoute(this.router.url);

    if (this.router.url.includes('promotion/')) {
      this.hideBottomNav = true;
    }

    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveRoute(event.url);
        }
      });

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

  private setActiveRoute(routeUrl: string) {
    if (routeUrl.includes(`/${this.params.companyCode}/promotion`)) {
      this.activeRoute = 'promo';
    } else if (routeUrl.includes(`/${this.params.companyCode}/order-history`)) {
      this.activeRoute = 'history';
    } else if (routeUrl.includes(`/${this.params.companyCode}/others`)) {
      this.activeRoute = 'others';
    } else {
      this.activeRoute = 'home';
    }
  }
}