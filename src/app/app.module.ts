import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { RouterModule } from '@angular/router';

const routes = [
  {path: '', component: HomePageComponent},
  {path: 'setup', component: SetupPageComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomePageComponent,
    SetupPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
