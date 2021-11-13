import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMenuData, IMenus } from '@core/models';
import { QSApiService } from '@core/services';

@Component({
  selector: 'app-search-menu',
  templateUrl: 'search-menu.component.html',
  styleUrls: ['./search-menu.component.scss'],
})

export class SearchMenuComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
  ) {
    route.params.subscribe(params => this.params = params);
    route.queryParams.subscribe(queryParams => this.queryParams = queryParams);
  }

  queryParams: any = {}
  params: any = {}

  menuData: IMenuData | undefined
  allMenus: IMenus[] = []
  filteredMenu: IMenus[] = []

  ngOnInit() {
    this.qsApiService.getMenu(this.params.branchCode, this.queryParams.visitPurposeID);

    this.qsApiService.menu.subscribe(menu => {
      this.menuData = menu;

      this.allMenus = menu ?
        menu.menuCategories.reduce((list: IMenus[], menuCategory) => {
          const menus = menuCategory.menuCategoryDetails.reduce((listMenus: IMenus[], menuCategoryDetail) => {
            return [...listMenus, ...menuCategoryDetail.menus];
          }, []);

          return [...list, ...menus];
        }, [])
        : [];
    });
  }

  goToMenu(menuID: number) {
    this.router.navigate([`../menu/${menuID}`], {
      relativeTo: this.route,
      queryParams: {
        mode: this.queryParams.mode,
        visitPurposeID: this.queryParams.visitPurposeID,
      },
    });
  }

  onChangeSearch(keyword: string) {
    this.filteredMenu = this.allMenus.filter(menu => menu.menuName.toLowerCase().includes(keyword.toLowerCase()));
  }
}