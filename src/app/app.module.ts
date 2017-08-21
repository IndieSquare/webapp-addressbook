import { RouterModule, Routes }   from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { OnsenModule } from 'angular2-onsenui';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app.component';
import { IndexComponent } from './components/index.component';
import { ListComponent } from './components/list.component';

const appRoutes: Routes = [
	{ path: 'list', component: ListComponent },
	{ path: 'index', component: IndexComponent },
	{ path: '', component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ListComponent
  ],
  imports: [
	OnsenModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [],
  bootstrap: [
  	AppComponent
  ],
  entryComponents: [],
  schemas: [
  	CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }