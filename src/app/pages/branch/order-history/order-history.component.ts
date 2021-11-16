import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderHistoryData, IUserData } from '@core/models';
import {  NavigationService, QSApiService, StorageService } from '@core/services';
import { formatIDR } from '@utils/formatIDR';

@Component({
  selector: 'app-order-history',
  templateUrl: 'order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public storageService: StorageService,
    public navigation: NavigationService,
  ) {}

  orderHistoryToday: IOrderHistoryData[] = []
  orderHistoryPast: IOrderHistoryData[] = []

  ngOnInit() {
    const userData = this.storageService.getItem('user');
    const orderHistoryData = this.storageService.getItem('orderHistory');
    
    if (userData && orderHistoryData) {
      const user = JSON.parse(userData) as IUserData;
      const orderHistory = JSON.parse(orderHistoryData) as string[];
      
      if (user.token) {
        this.qsApiService.getOrderHistory(user.token, orderHistory)
          .subscribe(orderHistoryResult => {

            orderHistoryResult.data.forEach(orderData => {
              const transactionDate = new Date(orderData.transactionDate);
              const currentDate = new Date();

              if (transactionDate.getDate() >= currentDate.getDate()) {
                this.orderHistoryToday.push(orderData);
              } else {
                this.orderHistoryPast.push(orderData);
              }
            });

            console.log(this.orderHistoryToday);
          });
      }
    }
  }

  formatToCurrency(price: number) {
    return formatIDR(price);
  }

  getHeaderText(orderData: IOrderHistoryData) {
    if (orderData) {
      const date = formatDate(orderData.transactionDate, 'dd MMMM YYYY', 'en');
      return `${date} • ID #${orderData.orderID}`;
    }

    return '';
  }

  getCurrentStatus(status: string) {
    if (status.includes('Finish')) {
      return 'COMPLETED';
    } else if (status.includes('Cancelled')) {
      return 'CANCELLED';
    } else {
      return 'ONGOING';
    }
  }

  goToOrderHistoryDetail(orderData: IOrderHistoryData) {
    return this.navigation.navigate(`${orderData.orderID}`, { relativeTo: this.route });
  }
}