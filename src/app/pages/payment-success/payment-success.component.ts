import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderData } from '@core/models/orderData';
import { NavigationService, QSApiService } from '@core/services';
import { formatIDR } from '@utils/formatIDR';

@Component({
  selector: 'app-payment-success',
  templateUrl: 'payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})

export class PaymentSuccessComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public navigation: NavigationService,
  ) {
    route.queryParams.subscribe(queryParams => this.queryParams = queryParams);
  }

  queryParams: any = {}
  orderData: IOrderData | undefined

  ngOnInit() {
    this.qsApiService.getOrder(this.queryParams.orderID)
      .subscribe(orderData => {
        this.orderData = orderData;
      });
  }

  formatCurrency(price: number) {
    return formatIDR(price);
  }

  getHourAndMinute(date: string) {
    if (!date) return '';

    const orderDate= new Date(date);
    return `${orderDate.getHours()}:${orderDate.getMinutes()}`;
  }

  goToOrderDetail() {
    return this.navigation.navigate(`/${this.orderData?.companyCode}/order-history/${this.queryParams.orderID}`);
  }
}