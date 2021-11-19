import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeID from '@angular/common/locales/id';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@core/core.module';
import { ComponentsModule } from '@components/components.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotFoundComponent } from '@pages/not-found/not-found.component';

registerLocaleData(localeID);

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserModule,
    ComponentsModule
  ],
  declarations: [
    NotFoundComponent,
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }],
})
export class AppModule { }
