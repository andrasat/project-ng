import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChooseContactComponent } from './choose-contact.component';

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: ChooseContactComponent,
  }])],
  exports: [RouterModule],
})
export class ChooseContactRoutingModule { }
