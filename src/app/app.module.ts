import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrederComponent } from './components/oreder/oreder.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { OrderUserComponent } from './components/order.user/order.user.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrederComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    OrderUserComponent,
    OrderStatusComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    provideHttpClient(),
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
