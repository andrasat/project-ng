import { Component, OnInit } from '@angular/core';
import { IOrderHistoryData, IUserData } from '@core/models';
import {  QSApiService, StorageService } from '@core/services';

@Component({
  selector: 'app-order-history',
  templateUrl: 'order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  constructor(
    public qsApiService: QSApiService,
    public storageService: StorageService,
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

          });
      }
    }
  }
}