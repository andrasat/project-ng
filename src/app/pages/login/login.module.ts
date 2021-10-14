import { NgModule } from "@angular/core";
import { ComponentsModule } from "@components/components.module";
import { CoreModule } from "@core/core.module";
import { IconModule } from "@icons/icons.module";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";

@NgModule({
  imports: [
    LoginRoutingModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    LoginComponent,
  ]
})
export class LoginModule {}