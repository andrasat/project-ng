import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBranchData, IBranchDataOrderModes, IExtras, IMenuExtras, IMenus } from '@core/models';
import { IDeliveryStatus, IOrderData, ISalesMenusOrderData } from '@core/models/orderData';
import { NavigationService, QSApiService } from '@core/services';
import { formatIDR } from '@utils/formatIDR';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-detail',
  templateUrl: 'order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})

export class OrderDetailComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public navigation: NavigationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  private unsubscribe$ = new Subject<void>()

  params: any = {}
  orderData: IOrderData | undefined
  branchData: IBranchData | undefined
  orderStatus: IDeliveryStatus[] = []
  displayMenus: ISalesMenusOrderData[] = []
  currentStatus = ''
  hideCollapse = true;

  ngOnInit() {
    this.qsApiService.getOrder(this.params.orderID)
      .subscribe(orderData => {
        console.log(orderData);
        this.orderData = orderData;
        this.orderStatus = orderData.delivery.status.sort((a,b) => {
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        });

        if (orderData.status.includes('Finish')) {
          this.currentStatus = 'COMPLETED';
        } else if (orderData.status.includes('Cancelled')) {
          this.currentStatus = 'CANCELLED';
        } else {
          this.currentStatus = 'ONGOING';
        }

        this.qsApiService.getBranchData(orderData.branchCode);
      });

    this.qsApiService.branchData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchData => {
        this.branchData = branchData;

        if (branchData) {
          const orderModes = branchData?.orderModes ? branchData.orderModes.reduce((orderModesArr: IBranchDataOrderModes[], orderMode) => {
            if (Array.isArray(orderMode)) {
              return [...orderModesArr, ...orderMode];
            }

            return [...orderModesArr, orderMode];
          }, []).map(mode => {

            if (mode.forms) {
              return {
                ...mode,
                forms: mode.forms.map(customForm => {
                  return { ...customForm, inputID: customForm.inputID.replace(`${branchData.companyCode.toLowerCase()}-`, '') };
                })
              };
            }

            return mode;
          }) : [];
          const orderMode = orderModes.find(mode => mode.type === this.orderData?.type);
          this.qsApiService.getMenu(this.orderData?.branchCode || '', orderMode?.visitPurposeID || '');
        }
      });

    this.qsApiService.menu
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(menu => {
        if (menu) {
          const allMenus = menu.menuCategories.reduce((menuList: IMenus[], menuCategory) => {
            const menusByDetail = menuCategory.menuCategoryDetails.reduce((menus: IMenus[], categoryDetail) => {
              return [...menus, ...categoryDetail.menus];
            }, []);

            return [...menuList, ...menusByDetail];
          }, []);

          this.displayMenus = this.orderData?.salesMenus.map(saleMenu => {
            const foundMenu = allMenus.find(menu => menu.menuID === saleMenu.menuID);
            saleMenu.imageUrl = foundMenu?.imageUrl || '';
            return saleMenu;
          }) || [];

          console.log(this.displayMenus);
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  formatToCurrency(price: number) {
    return formatIDR(price);
  }

  showQRCode() {
    this.hideCollapse = false;
  }

  clickOnCollapseOverlay() {
    this.hideCollapse = true;
  }

  getPaymentImage() {
    return `/assets/image/${this.orderData?.salesPayment.paymentMethodID || ''}.png`;
  }

  getCustomClass(index?: number) {
    return {
      ongoing: this.currentStatus === 'ONGOING' && index === this.orderStatus.length - 1,
      cancelled: this.currentStatus === 'CANCELLED'
    };
  }

  getHeaderText() {
    if (this.orderData) {
      const date = formatDate(this.orderData.transactionDate, 'dd MMMM YYYY', 'en');
      return `${date} • ID #${this.params.orderID}`;
    }

    return '';
  }

  getStatusTime(time: string) {
    return formatDate(time, 'hh:mm', 'en');
  }

  goToRestaurant() {
    return this.navigation.navigate(`../../${this.orderData?.branchCode}`, { relativeTo: this.route });
  }

  goToFeedback() {
    return this.navigation.navigate('feedback', { relativeTo: this.route });
  }

  goBack() {
    return this.navigation.navigate('..', { relativeTo: this.route });
  }
}