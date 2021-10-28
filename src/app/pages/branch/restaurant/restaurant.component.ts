import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranchData, IBranchDataOrderModes, IMenuData, IMenus, IPromotion } from '@core/models';
import { QSApiService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-restaurant',
  templateUrl: 'restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {
  constructor(
    public collapseConfig: NgbCollapseConfig,
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
  ) {
    collapseConfig.animation = false;

    route.params.subscribe(params => {
      this.params = params;
    });

    route.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;
    });
  }

  showSelectOrderMode = false
  selectedOrderMode: string = ''
  selectedHour: string = ''
  selectedMinute: string = ''
  businessHourText = ''

  orderModes: IBranchDataOrderModes[]
  menuData: IMenuData | undefined
  branchData: IBranchData | undefined
  promotions: IPromotion[] | undefined

  popularMenu: IMenus[] = []
  priceChoppedMenu: IMenus[] = []

  params: any = {}
  queryParams: any = {}

  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnInit() {
    this.qsApiService.getBranchData(this.params.branchCode);
    this.qsApiService.getPromotion(this.params.branchCode);

    this.qsApiService.promotion.subscribe(promotions => this.promotions = promotions);
    this.qsApiService.menu.subscribe(menu => {
      this.menuData = menu;

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

      this.popularMenu = popularMenuList || [];
    });

    this.qsApiService.branchData.subscribe(branchData => {
      this.branchData = branchData;

      const today = branchData?.businessHour.find(hour => hour.isCurrentDay);
      this.businessHourText = `${branchData?.businessHour[0].day} - ${branchData?.businessHour[branchData?.businessHour.length - 1].day} ${today?.startTime} - ${today?.endTime}`;
      this.orderModes = branchData?.orderModes ? branchData?.orderModes.filter(mode => mode.type?.match(/takeAway|delivery/)) : [];

      if (branchData && this.queryParams.orderMode) {
        this.showSelectOrderMode = true;
        const selectedMode = this.orderModes.find(mode => mode.type === this.queryParams.orderMode);
        console.log('this.orderModes: ', this.orderModes);
        this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);
      }
    });
  }

  selectOrderMode(orderMode?: string) {
    this.selectedOrderMode = orderMode || '';
  }

  onSelectedHour(hour: string) {
    this.selectedHour = hour;
  }

  onSelectedMinute(minute: string) {
    this.selectedMinute = minute;
  }

  clickContinueOrderMode() {
    if (this.selectedOrderMode === '') {
      this.router.navigate([`/${this.branchData?.companyCode}`]);
      return;
    }

    this.showSelectOrderMode = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
        ...(this.selectedHour && this.selectedMinute ? {
          takeAwayTime: `${this.selectedHour}:${this.selectedMinute}`,
        } : {}),
      },
      queryParamsHandling: 'merge',
    });

    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);
    this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);
  }

  goBack() {
    this.router.navigate([`/${this.branchData?.companyCode}`]);
  }
}