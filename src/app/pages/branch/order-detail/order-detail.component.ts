import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderData } from '@core/models/orderData';
import { QSApiService } from '@core/services';

@Component({
  selector: 'app-order-detail',
  templateUrl: 'order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})

export class OrderDetailComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  params: any = {}
  orderData: IOrderData | undefined

  ngOnInit() {
    this.qsApiService.getOrder(this.params.orderID)
      .subscribe(orderData => this.orderData = orderData);
  }
}