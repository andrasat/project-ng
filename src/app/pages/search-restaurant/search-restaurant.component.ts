import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-restaurant',
  templateUrl: 'search-restaurant.component.html',
  styleUrls: ['./search-restaurant.component.scss'],
})

export class SearchRestaurantComponent implements OnInit {

  ngOnInit() {
    console.log('search restaurants');
  }
}