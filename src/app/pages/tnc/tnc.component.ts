import { Component, OnInit } from '@angular/core';
import { ITNCData } from '@core/models';
import { NavigationService, QSApiService } from '@core/services';

@Component({
  selector: 'app-tnc',
  templateUrl: 'tnc.component.html',
  styleUrls: ['./tnc.component.scss'],
})

export class TNCComponent implements OnInit {
  constructor(
    public qsApiService: QSApiService,
    public navigation: NavigationService,
  ) { }

  tncData: ITNCData[] = []

  ngOnInit() {
    this.qsApiService.getTNCData().subscribe(tncData => this.tncData = tncData);
  }

  clickToContinue() {
    return this.navigation.back();
  }
}