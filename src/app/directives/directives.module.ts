import { NgModule } from '@angular/core';

import { BackButtonDirective } from './back-button.directive';

@NgModule({
  declarations: [
    BackButtonDirective,
  ],
  exports: [
    BackButtonDirective,
  ],
})
export class DirectivesModule { }
