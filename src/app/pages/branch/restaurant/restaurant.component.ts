import { formatCurrency } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranchData, IBranchDataOrderModes, IBranches, IBranchList, ICustomOrderFormData, ICustomOrderModeForms, IMenuCategoryDetails, IMenuData, IMenus, IOrderInput, IPromotion } from '@core/models';
import { LocationService, QSApiService, StorageService, NavigationService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant',
  templateUrl: 'restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public locationService: LocationService,
    public storageService: StorageService,
    public navigation: NavigationService,
    public collapseConfig: NgbCollapseConfig,
  ) {
    collapseConfig.animation = false;

    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;

      if (queryParams.orderMode) {
        this.selectedOrderMode = queryParams.orderMode;
      }
    });
  }

  @ViewChildren('orderModeButton') orderModeButtonRefs: QueryList<ElementRef<HTMLButtonElement>>

  private unsubscribe$ = new Subject<void>()

  customOrderFormGroup: FormGroup | undefined
  tableNumberControl: FormControl | undefined

  hideCollapseContainer = false
  showMenuDrawer = false;
  showOutletClosed: boolean | undefined
  customOrderModeForm: ICustomOrderModeForms[] | undefined
  customOrderFormData: ICustomOrderFormData[] | undefined
  selectedOrderMode = ''
  selectedHour = ''
  selectedMinute = ''
  businessHourText = ''
  displayTotalAmount = ''

  menuData: IMenuData | undefined
  branchData: IBranchData | undefined
  branchList: IBranchList | undefined
  currentPosition: GeolocationPosition
  orderInput: IOrderInput | undefined

  orderModes: IBranchDataOrderModes[] = []
  openBranches: IBranches[] = []
  promotions: IPromotion[] = []
  popularMenus: IMenus[] = []
  priceChoppedMenus: IMenus[] = []

  params: any = {}
  queryParams: any = {}

  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnDestroy() {
    this.qsApiService.resetMenu();
    this.qsApiService.resetBranchData();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.qsApiService.getBranchData(this.params.branchCode);
    this.qsApiService.getPromotion(this.params.branchCode);

    if (this.queryParams.orderMode === 'delivery' && this.queryParams.lat && this.queryParams.lng) {
      this.locationService.updateCurrentPosition({
        coords: {
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: this.queryParams.lat,
          longitude: this.queryParams.lng,
          speed: null,
        },
        timestamp: Date.now(),
      });
    }

    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => this.currentPosition = position);
    this.qsApiService.promotion
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(promotions => this.promotions = promotions || []);

    this.qsApiService.branchList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchList => {
        this.branchList = branchList;

        this.openBranches = branchList ?
          branchList.branches.filter(branch => branch.businessHour.status.includes('open'))
          : [];
      });

    this.qsApiService.branchData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchData => {
        this.branchData = branchData;

        const today = branchData?.businessHour.find(hour => hour.isCurrentDay);
        this.businessHourText = `${branchData?.businessHour[0].day} - ${branchData?.businessHour[branchData?.businessHour.length - 1].day} ${today?.startTime} - ${today?.endTime}`;
        this.showOutletClosed = typeof branchData?.isOpen !== 'undefined' ? !branchData?.isOpen : undefined;

        if (!this.branchList && this.showOutletClosed === true) {
          this.qsApiService.getBranchList(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
        }

        // map and reformat orderModes
        this.orderModes = branchData?.orderModes ? branchData.orderModes.reduce((orderModesArr: IBranchDataOrderModes[], orderMode) => {
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

        if (branchData && this.queryParams.orderMode) {
          const selectedMode = this.orderModes.find(mode => mode.type === this.queryParams.orderMode);
          const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

          // adjust custom order mode with query params
          if (this.queryParams.orderMode === 'custom' && selectedMode && selectedMode.forms) {
            this.customOrderModeForm = selectedMode.forms;
            this.customOrderFormGroup = new FormGroup(selectedMode.forms.reduce((formObject, form) => {
              return {
                ...formObject,
                [form.inputID]: new FormControl(
                  {
                    value: this.queryParams[form.inputID],
                    disabled: !!this.queryParams[form.inputID]
                  },
                  form.flagMandatory ? [Validators.required] : undefined,
                )
              };
            }, {}));

            this.orderModeButtonRefs?.changes
              .pipe(take(1))
              .subscribe((queryList: QueryList<ElementRef<HTMLButtonElement>>) => {
                const [customButton] = queryList.filter(button => button.nativeElement.className.includes('active'));
                customButton.nativeElement.scrollIntoView({ behavior: 'smooth' });
              });
          } else {
            this.hideCollapseContainer = true;
            this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);
          }

          if (orderInputData) {
            this.orderInput = JSON.parse(orderInputData) as IOrderInput;

            // decide if there is additionalCustomerInfo, hide custom form at open page
            if (this.orderInput.additionalCustomerInfo && selectedMode && selectedMode.forms) {
              let mandatoryFlagCounter = 0;
              const mandatoryFlagCount = selectedMode.forms?.filter(form => form.flagMandatory > 0).length;

              const hideCollapseContainer = this.orderInput.additionalCustomerInfo.reduce((result, formData) => {
                if (mandatoryFlagCounter === mandatoryFlagCount || mandatoryFlagCount === 0) {
                  return true;
                }

                const foundForm = selectedMode.forms?.find(form => form.inputLabelEn === formData.desc);

                if (foundForm && foundForm.flagMandatory > 0 && formData.value) {
                  mandatoryFlagCounter++;
                  return result;
                }

                return result;
              }, false);

              mandatoryFlagCounter = 0;

              if (hideCollapseContainer) {
                this.hideCollapseContainer = true;
                this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);
              }
            }

            if (this.queryParams.orderMode === 'dineIn' && this.queryParams.tableNumber) {
              this.orderInput.tableName = this.queryParams.tableNumber;
            }

            this.orderInput!.type = selectedMode?.type!;
            this.orderInput!.typeName = selectedMode?.name || null;
            this.orderInput!.visitPurposeID = selectedMode?.visitPurposeID!;

            const totalAmount = this.orderInput!.salesMenus.reduce((total, saleMenu) => {
              const totalPackage = saleMenu.packages.reduce((amountPackages, packageData) => {
                return amountPackages + (packageData.sellPrice * saleMenu.qty);
              }, 0);

              const totalExtras = saleMenu.extras.reduce((amountExtras, extraData) => {
                return amountExtras + (extraData.sellPrice * saleMenu.qty);
              }, 0);

              return total + totalPackage + totalExtras + (saleMenu.sellPrice * saleMenu.qty);
            }, 0);

            this.orderInput!.amount = totalAmount;
            this.displayTotalAmount = formatCurrency(totalAmount, 'id-ID', 'Rp', 'IDR', '1.0-0');
          } else {
            this.orderInput = {
              type: selectedMode?.type!,
              tableName: this.queryParams.tableNumber,
              typeName: selectedMode?.name || null,
              amount: 0,
              deliveryAddress: this.queryParams.addr || '',
              deliveryAddressInfo: null,
              email: '',
              fullName: '',
              memberID: null,
              paymentMethodID: '',
              visitPurposeID: selectedMode?.visitPurposeID!,
              latitude: this.queryParams.lat || this.currentPosition.coords.latitude,
              longitude: this.queryParams.lng || this.currentPosition.coords.longitude,
              phoneNumber: '',
              promotionCode: '',
              salesMenus: [],
              vouchers: [],
              returnUrl: '',
            };
          }

          this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
        }
      });

    this.qsApiService.menu
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(menu => {
        this.menuData = menu;

        // Get recommendation menu id list
        const recommendationMenuIdList = menu?.menuRecommendations?.reduce((menuIdList: number[], nextRecommendation) => {
          const menuIds = nextRecommendation.menuIDs;

          if (menuIdList.length === 0) return [...menuIds];

          let menuIdString = menuIds.join(',');

          menuIdList.forEach(menuId => {
            if (menuIdString.includes(String(menuId))) {
              menuIdString = menuIdString.replace(String(menuId), '');
            }
          });

          const newMenuIds = menuIdString
            .split(',')
            .filter(menuId => !!menuId)
            .map(menuId => Number(menuId));

          return [...menuIdList, ...newMenuIds];
        }, []);

        // Get menu list by recommendation ids
        const popularMenuList = menu?.menuCategories.reduce((list: IMenus[], menuCategory) => {

          const menusByCategoryDetail = menuCategory.menuCategoryDetails.reduce((menuList: IMenus[], menuCategoryDetail) => {
            return [ ...menuList, ...menuCategoryDetail.menus];
          }, []);

          const recommendationMenus = recommendationMenuIdList ?
            recommendationMenuIdList.reduce((menus: IMenus[], nextMenuId) => {
              const recommendedMenu = menusByCategoryDetail.find(menu => menu.menuID === nextMenuId);
              const isAlreadyInList = list.find(menu => menu.menuID === nextMenuId);

              if (recommendedMenu && !isAlreadyInList) {
                return [...menus, recommendedMenu];
              }

              return menus;
            }, [])
            : menusByCategoryDetail;

          return [...list, ...recommendationMenus];
        }, []);

        // Get price chopped menu list
        const priceChoppedMenuList = menu?.menuCategories.reduce((list: IMenus[], menuCategory) => {

          const menusByCategoryDetail = menuCategory.menuCategoryDetails.reduce((menuList: IMenus[], menuCategoryDetail) => {
            return [ ...menuList, ...menuCategoryDetail.menus]; 
          }, []);

          const priceChoppedMenus = menusByCategoryDetail.filter(menus => menus.originalSellPrice !== menus.sellPrice);

          return [...list, ...priceChoppedMenus];
        }, []);

        this.popularMenus = popularMenuList || [];
        this.priceChoppedMenus = priceChoppedMenuList || [];
      });
  }

  getOrderModeText(mode: string, name?: string) {
    switch (mode) {
      case 'dineIn':
        return 'Dine In';
      case 'delivery':
        return 'Delivery';
      case 'takeAway':
        return 'In-Store Pick Up';
      default:
        return name || 'Custom';
    }
  }

  getFragmentId(menuDesc: string) {
    return menuDesc.replace(/\W/g, '');
  }

  getMenuLength(menuCategoryDetails: IMenuCategoryDetails[]) {
    return menuCategoryDetails.reduce((total, menuCategoryDetail) => {
      return menuCategoryDetail.menus.length + total;
    }, 0);
  }

  selectOrderMode(mode: IBranchDataOrderModes) {
    this.selectedOrderMode = mode.type || '';
    this.customOrderModeForm = mode.forms;

    if (mode.type === 'dineIn') {
      this.tableNumberControl = new FormControl(this.queryParams.tableNumber || '', [Validators.required]);
    } else {
      this.tableNumberControl = undefined;
    }

    if (mode.forms) {
      this.customOrderFormGroup = new FormGroup(mode.forms.reduce((formObject, form) => {
        return {
          ...formObject,
          [form.inputID]: new FormControl(
            {
              value: this.queryParams[form.inputID],
              disabled: !!this.queryParams[form.inputID]
            },
            form.flagMandatory ? [Validators.required] : undefined,
          )
        };
      }, {}));
    } else {
      this.customOrderFormGroup = undefined;
    }
  }

  onSelectedHour(hour: string) {
    this.selectedHour = hour;
  }

  onSelectedMinute(minute: string) {
    this.selectedMinute = minute;
  }

  clickOpenMenuDrawer() {
    this.hideCollapseContainer = false;
    this.showMenuDrawer = true;
  }

  closeCollapse() {
    this.hideCollapseContainer = true;
    this.showMenuDrawer = false;
  }

  clickContinueOrderMode() {
    if (this.selectedOrderMode === '') {
      this.goBack();
      return;
    }

    if (this.tableNumberControl) {
      if (!this.tableNumberControl.valid) return;
    }

    if (this.customOrderFormGroup) {
      if (!this.customOrderFormGroup.valid) return;

      const formRawValue = this.customOrderFormGroup.getRawValue();
      this.customOrderFormData = this.customOrderModeForm?.map(form => {
        const formValue = form.inputID.includes('pickuptime') ? `${this.selectedHour}:${this.selectedMinute}` : formRawValue[form.inputID];
      
        return {
          desc: form.inputLabelEn,
          value: formValue,
        };
      });
    }

    this.hideCollapseContainer = true;

    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);
    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

    if (selectedMode?.type === 'takeAway') {
      const selectedDate = new Date();
      selectedDate.setHours(Number(this.selectedHour));
      selectedDate.setMinutes(Number(this.selectedMinute));

      if (selectedDate.getTime() < Date.now()) return;
      this.customOrderFormData = [{desc: 'Pickup Time', value: `${this.selectedHour}:${this.selectedMinute}`}];
    }

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
      this.orderInput!.type = selectedMode?.type!;
      this.orderInput!.typeName = selectedMode?.type! === 'custom' && selectedMode?.name ? selectedMode?.name : null;
      this.orderInput!.visitPurposeID = selectedMode?.visitPurposeID!;
      this.orderInput!.additionalCustomerInfo = this.customOrderFormData;
    } else {
      this.orderInput = {
        additionalCustomerInfo: this.customOrderFormData,
        tableName: this.tableNumberControl?.value,
        type: selectedMode?.type!,
        typeName: selectedMode?.name || null,
        amount: 0,
        deliveryAddress: '',
        deliveryAddressInfo: null,
        email: '',
        fullName: '',
        memberID: null,
        paymentMethodID: '',
        visitPurposeID: selectedMode?.visitPurposeID!,
        latitude: this.currentPosition.coords.latitude,
        longitude: this.currentPosition.coords.longitude,
        phoneNumber: '',
        promotionCode: '',
        salesMenus: [],
        vouchers: [],
        returnUrl: '',
      };
    }

    this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);

    this.navigation.navigate(undefined, {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
      },
      queryParamsHandling: 'merge',
    });
  }

  goBack() {
    this.storageService.removeItem(`order_${this.params.companyCode}_${this.params.branchCode}`);
    this.navigation.back('..', { relativeTo: this.route });
  }

  goToPromoPage() {
    if (this.promotions.length === 0) return;

    return this.navigation.navigate('../promotion', {
      relativeTo: this.route,
      queryParams: {
        branchCode: this.params.branchCode,
      },
    });
  }

  goToMenu(menuID: number) {
    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);

    return this.navigation.navigate(`menu/${menuID}`, {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.queryParams.orderMode,
        visitPurposeID: selectedMode?.visitPurposeID!,
      },
    });
  }

  goToFragment(fragmentId: string) {
    this.hideCollapseContainer = true;
    this.showMenuDrawer = false;

    try {
      document.querySelector(`#${fragmentId.replace(/\W/g, '')}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    } catch(e) {
      // 
    }
  }

  goToRestaurant(branchCode: string) {
    this.qsApiService.resetMenu();
    this.qsApiService.getBranchData(branchCode);

    return this.navigation.navigate(`../${branchCode}`, { relativeTo: this.route, replaceUrl: true });
  }

  goToSearchMenu() {
    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);

    this.navigation.navigate(`search-menu`, {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
        visitPurposeID: selectedMode?.visitPurposeID!,
      },
    });
  }

  goToCheckout() {
    this.navigation.navigate(`checkout`, {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
      }
    });
  }

}