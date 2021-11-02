import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranchData, ICalculateTotalResult, IMenuData, IMenus, IOrderInput } from '@core/models';
import { QSApiService, StorageService } from '@core/services';
import { calculateTotalData } from '@core/mock';
import { formatIDR } from '@utils/formatIDR';
import { separateAddress } from '@utils/separateAddress';

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})

export class CheckoutComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public storageService: StorageService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  branchData: IBranchData | undefined
  menuData: IMenuData | undefined
  menusAddMore: IMenus[]
  orderInput: IOrderInput
  calculateResult: ICalculateTotalResult

  params: any = {}
  queryParams: any = {}

  ngOnInit() {
    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
      console.log('this.orderInput: ', this.orderInput);
    } else {
      this.goBack();
    }

    this.qsApiService.getBranchData(this.params.branchCode);
    this.qsApiService.getMenu(this.params.branchCode, this.orderInput.visitPurposeID);

    this.qsApiService.branchData.subscribe(branchData => this.branchData = branchData);
    this.qsApiService.menu.subscribe(menu => {
      this.menuData = menu;

      this.menusAddMore = menu?.menuCategories.reduce((menuList: IMenus[], menuCategory) => {

        const menuListByDetail = menuCategory.menuCategoryDetails.reduce((menus: IMenus[], menuCategoryDetail) => {
          return [...menus, ...menuCategoryDetail.menus];
        }, []);

        return [...menuList, ...menuListByDetail].splice(0, 10);
      }, []) || [];
    });

    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .subscribe(
        calculateTotalResult => this.calculateResult = calculateTotalResult,
        () => this.calculateResult = calculateTotalData(),
      );
  }

  separateAddress(address: string) {
    return separateAddress(address);
  }

  formatToCurrency(price: number) {
    return formatIDR(price);
  }

  goBack() {
    this.router.navigate(['..'], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.queryParams.orderMode,
      }
    });
  }

  goToMenu(menuID: number) {
    this.router.navigate([`../menu/${menuID}`], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.queryParams.orderMode,
        visitPurposeID: this.orderInput.visitPurposeID,
      }
    });
  }

  goToRestaurant() {
    this.router.navigate(['..'], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.queryParams.orderMode,
      },
    });
  }

  goToSearchLocation() {
    this.router.navigate(['/location'], {
      queryParams: {
        companyCode: this.params.companyCode,
        branchCode: this.params.branchCode,
        from: 'checkout',
      }
    });
  }
}