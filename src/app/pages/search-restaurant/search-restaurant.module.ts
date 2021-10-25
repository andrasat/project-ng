import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { SearchRestaurantRoutingModule } from './search-restaurant-routing.module';
import { SearchRestaurantComponent } from './search-restaurant.component';

@NgModule({
  imports: [
    SearchRestaurantRoutingModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [SearchRestaurantComponent],
})
export class SearchRestaurantModule { }
