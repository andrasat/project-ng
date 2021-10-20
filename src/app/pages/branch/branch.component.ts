import { Component, OnInit } from '@angular/core';
import { IBranchList } from '@core/models';
import { LocationService, QSApiService } from '@core/services';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  constructor(
    public locationService: LocationService,
    public qsApiService: QSApiService,
  ) {}

  branchList: IBranchList | undefined

  ngOnInit() {
    this.locationService.currentPosition.subscribe(position => {
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
  }
}