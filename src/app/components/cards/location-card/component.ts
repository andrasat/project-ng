import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-card',
  templateUrl: 'location-card.component.html',
  styleUrls: ['./location-card.component.scss'],
})

export class LocationCardComponent {
  @Input() showArrow: boolean = false
}