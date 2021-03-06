import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class NavigationService {
  constructor(
    private router: Router,
    private location: Location,
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  private history: string[] = []
  
  back(url?: string, navigationExtras: NavigationExtras = {}) {
    this.history.pop();

    if (url) {
      return this.router.navigate([url], { ...navigationExtras, replaceUrl: true });
    }

    if (this.history.length > 0 && !url) {
      return this.location.back();
    }

    return this.router.navigateByUrl('/');
  }

  navigate(url?: string, navigationExtras?: NavigationExtras) {
    return this.router.navigate(url ? [url] : [], navigationExtras);
  }
}