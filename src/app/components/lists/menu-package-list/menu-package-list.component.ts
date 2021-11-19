import { formatCurrency } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IPackages } from '@core/models';

@Component({
  selector: 'app-menu-package-list',
  templateUrl: 'menu-package-list.component.html',
  styleUrls: ['./menu-package-list.component.scss'],
})

export class MenuPackageListComponent implements OnInit {
  @Input() package: IPackages
  @Input() selected: boolean = false;
  
  priceDisplay: string = ''

  ngOnInit() {
    this.priceDisplay = this.package?.sellPrice > 0 ? formatCurrency(this.package?.sellPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
  }
}