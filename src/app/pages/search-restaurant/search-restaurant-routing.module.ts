import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchRestaurantComponent } from './search-restaurant.component';

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: SearchRestaurantComponent,
  }])],
  exports: [RouterModule],
})
export class SearchRestaurantRoutingModule { }
