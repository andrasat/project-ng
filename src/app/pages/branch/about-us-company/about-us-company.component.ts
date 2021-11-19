import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@core/services';

@Component({
  selector: 'app-about-us-company',
  templateUrl: 'about-us-company.component.html',
  styleUrls: ['./about-us-company.component.scss'],
})

export class AboutUsCompanyComponent {
  constructor(
    public route: ActivatedRoute,
    public navigation: NavigationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  params: any = {}

  goBack() {
    this.navigation.back(`/${this.params.companyCode}`);
  }
}