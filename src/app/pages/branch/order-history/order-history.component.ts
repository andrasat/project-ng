import { Component, OnInit } from '@angular/core';
import { IUserData } from '@core/models';
import { AuthService, QSApiService, StorageService } from '@core/services';

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

  ngOnInit() {
    const userData = this.storageService.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData) as IUserData;
      
      // if (user.token) this.qsApiService.getOrderHistory(user.token, [])
    }
  }
}