import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: 'restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent {
  @Input() thumbnailImage: string
  @Input() restaurantName: string
  @Input() restaurantPlace: string
  @Input() restaurantDistance: string
  @Input() isClosed: boolean = false
  @Input() showDistanceBelow: boolean = false
}