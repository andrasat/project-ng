import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: 'restaurant.component.html'
})

export class RestaurantComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('restaurant home');
  }
}