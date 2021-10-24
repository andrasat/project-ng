import { NgModule } from '@angular/core';

import { SearchRestaurantRoutingModule } from './search-restaurant-routing.module';
import { SearchRestaurantComponent } from './search-restaurant.component';

@NgModule({
  imports: [
    SearchRestaurantRoutingModule
  ],
  declarations: [SearchRestaurantComponent],
})
export class SearchRestaurantModule { }
