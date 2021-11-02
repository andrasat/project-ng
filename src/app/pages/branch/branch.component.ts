import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit, OnDestroy {
  constructor(
    public locationService: LocationService,
    public qsApiService: QSApiService,
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
}