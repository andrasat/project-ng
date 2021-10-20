import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-menu',
  templateUrl: 'add-menu.component.html'
})

export class AddMenuComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('add-menu');
  }
}