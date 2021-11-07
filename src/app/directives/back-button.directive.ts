import { Directive, HostListener, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavigationService } from '@core/services';

@Directive({ selector: '[backButton]' })
export class BackButtonDirective {
  constructor(
    private navigation: NavigationService,
  ) {}

  @Input() url: string | undefined
  @Input() navExtras: NavigationExtras | undefined

  @HostListener('click')
  onClick() {
    return this.navigation.back(this.url, this.navExtras);
  }
}