import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branch-home',
  templateUrl: 'branch-home.component.html'
})

export class BranchHomeComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('branch home');
  }
}