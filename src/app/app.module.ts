import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './user/home/home.component';
import { DetailComponent } from './user/detail/detail.component';
import { HeaderComponent } from './user/layout/header/header.component';
import { FooterComponent } from './user/layout/footer/footer.component';
import { LayoutComponent } from './user/layout/layout/layout.component';
import { CategoryComponent } from './user/category/category.component';
import { CartComponent } from './user/cart/cart.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './user/login/login/login.component';
import { VoucherComponent } from './user/voucher/voucher.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    CategoryComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    VoucherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
