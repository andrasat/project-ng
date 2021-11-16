import { formatCurrency } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExtras, IMenuPackagesInput, IMenus, IOrderInput, IPackages, ISalesMenusInput } from '@core/models';
import { NavigationService, QSApiService, StorageService } from '@core/services';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit, AfterViewInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public storageService: StorageService,
    public navigation: NavigationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = queryParams);
  }

  @ViewChild('notesInput') notesInputRef: ElementRef<HTMLTextAreaElement>

  params: any = {}
  queryParams: any = {}
  menu: IMenus | undefined;
  saleMenu: ISalesMenusInput
  counter = 1
  orderInput: IOrderInput
  totalAmount = 0

  priceDisplay: string = ''
  discountedPriceDisplay: string = ' '

  ngAfterViewInit() {
    fromEvent(this.notesInputRef.nativeElement, 'input')
      .pipe(
        filter(Boolean),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.saleMenu = {
          ...this.saleMenu,
          notes: this.notesInputRef.nativeElement.value,
        };
      });
  }

  ngOnInit() {
    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
    } else {
      this.navigation.back('../..', {
        relativeTo: this.route,
        queryParams: {
          mode: this.queryParams.mode,
        }
      });
    }

    this.qsApiService.getMenu(this.params.branchCode, this.queryParams.visitPurposeID);

    this.qsApiService.menu.subscribe(menu => {

      this.menu = menu ?
        menu?.menuCategories.reduce((menu: IMenus | undefined, menuCategory) => {
          const foundMenu = menuCategory.menuCategoryDetails.reduce((menuData: IMenus | undefined, menuCategoryDetail) => {
            return menuCategoryDetail.menus.find(m => m.menuID === Number(this.params.menuID)) || menuData;
          }, undefined);

          return foundMenu || menu;
        }, undefined)
        : undefined;

      const defaultPackages = this.menu?.menuPackages.reduce((inputs: IMenuPackagesInput[], menuPackage) => {
        const packagesWithFlagDefault = menuPackage.packages.filter(p => p.flagDefault > 0);

        if (packagesWithFlagDefault.length > 0) {
          return [
            ...inputs,
            ...packagesWithFlagDefault.map(p => {
              return {
                menuID: p.menuID,
                menuName: p.menuName,
                menuGroupID: p.menuGroupID,
                sellPrice: p.sellPrice,
                qty: 1,
              } as IMenuPackagesInput;
            }),
          ];
        } else {
          return inputs;
        }
      }, []);

      const foundMenu = this.orderInput.salesMenus.find(m => m.menuID === this.menu?.menuID!);

      this.counter = foundMenu ? foundMenu.qty : 1;
      this.saleMenu = {
        menuID: this.menu?.menuID!,
        menuName: this.menu?.menuName!,
        sellPrice: this.menu?.sellPrice!,
        imageUrl: this.menu?.imageUrl!,
        qty: this.counter,
        packages: foundMenu ? foundMenu.packages : (defaultPackages || []),
        extras: [],
        notes: '',
      };
      this.priceDisplay = this.menu ? formatCurrency(this.menu.originalSellPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
      this.discountedPriceDisplay = this.menu && this.menu.sellPrice !== this.menu.originalSellPrice ? formatCurrency(this.menu.sellPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
    });
  }

  getSelectedPackage(packageData: IPackages) {
    const existingPackageIndex = this.saleMenu.packages.findIndex(p => p.menuID === packageData.menuID);

    if (existingPackageIndex >= 0) return true;
    return false;
  }

  selectPackage(packageData: IPackages) {
    const existingPackageIndex = this.saleMenu.packages.findIndex(p => p.menuGroupID === packageData.menuGroupID);

    if (existingPackageIndex >= 0) {
      this.saleMenu.packages[existingPackageIndex].menuID = packageData.menuID;
      this.saleMenu.packages[existingPackageIndex].menuName = packageData.menuName;
      this.saleMenu.packages[existingPackageIndex].sellPrice = packageData.sellPrice;
    } else {
      this.saleMenu = {
        ...this.saleMenu,
        packages: [...this.saleMenu.packages, {
          menuGroupID: packageData.menuGroupID,
          menuID: packageData.menuID,
          menuName: packageData.menuName,
          sellPrice: packageData.sellPrice,
          qty: 1,
        }],
      };
    }
  }

  addExtras(extra: IExtras) {
    const existingExtraIndex = this.saleMenu.extras.findIndex(e => e.menuExtraID === extra.menuExtraID);

    if (existingExtraIndex >= 0) {
      this.saleMenu.extras[existingExtraIndex].qty = this.saleMenu.extras[existingExtraIndex].qty + 1;
    } else {
      this.saleMenu = {
        ...this.saleMenu,
        extras: [...this.saleMenu.extras, {
          menuExtraID: extra.menuExtraID,
          menuExtraName: extra.menuExtraName,
          sellPrice: extra.sellPrice,
          qty: 1,
        }]
      };
    }
  }

  decrement() {
    if (this.counter === 0) return;
    this.counter = this.counter - 1;
    this.saleMenu = {
      ...this.saleMenu,
      qty: this.counter,
    };
  }

  increment() {
    this.counter = this.counter + 1;
    this.saleMenu = {
      ...this.saleMenu,
      qty: this.counter,
    };
  }

  getSubmitButtonText() {
    if (this.queryParams.edit && this.counter === 0) return 'BACK TO CHECKOUT';
    if (this.counter === 0) return 'BACK TO RESTAURANT';
    return this.getTotalText();
  }

  getTotalText() {
    const totalMenuPrice =
      ((this.menu?.sellPrice || 0) * this.saleMenu.qty) +
      ((this.menu?.menuExtras.reduce((total, menuExtra) => {

        const totalExtraPrice = menuExtra.extras.reduce((extrasPrice, extra) => {
          const foundExtra = this.saleMenu.extras.find(e => e.menuExtraID === extra.menuExtraID);

          if (foundExtra) return extrasPrice + extra.sellPrice;
          return extrasPrice;
        }, 0);

        return total + totalExtraPrice;
      }, 0) || 0) * this.saleMenu.qty) +
      ((this.menu?.menuPackages.reduce((total, menuPackage) => {

        const totalPackagePrice = menuPackage.packages.reduce((packagePrice, packageData) => {
          const foundPackage = this.saleMenu.packages.find(p => p.menuID === packageData.menuID);

          if (foundPackage) return packagePrice + packageData.sellPrice;
          return packagePrice;
        }, 0);

        return total + totalPackagePrice;
      }, 0) || 0) * this.saleMenu.qty);
    
    this.totalAmount = totalMenuPrice;

    return `ADD TO CART ${formatCurrency(totalMenuPrice, 'id-ID', 'Rp', 'IDR', '1.0-0')}`;
  }

  goBack() {
    if (this.saleMenu.menuID) {
      const foundMenuIndex = this.orderInput.salesMenus.findIndex(s => s.menuID === this.saleMenu.menuID);

      if (foundMenuIndex >= 0 && this.saleMenu.qty > 0) {
        this.orderInput.salesMenus[foundMenuIndex] = this.saleMenu;
      } else if (foundMenuIndex >= 0 && this.saleMenu.qty === 0) {
        this.orderInput.salesMenus.splice(foundMenuIndex, 1);
      } else if (this.saleMenu.qty > 0) {
        this.orderInput = {
          ...this.orderInput,
          salesMenus: [...this.orderInput.salesMenus, this.saleMenu],
        };
      }

      this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    }

    if (this.queryParams.edit) {
      return this.navigation.back('../../checkout', {
        relativeTo: this.route,
        queryParams: {
          mode: this.queryParams.mode,
        }
      });;
    }

    return this.navigation.back('../..', {
      relativeTo: this.route,
      queryParams: {
        mode: this.queryParams.mode,
      }
    });
  }
}