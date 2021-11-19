import { NgModule } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IconModule } from '@icons/icons.module';
import { ComponentsModule } from '@components/components.module';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';

@NgModule({
  imports: [
    LocationRoutingModule,
    NgbCollapseModule,
    LeafletModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [LocationComponent],
})
export class LocationModule { }
