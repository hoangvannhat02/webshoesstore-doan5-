import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { DetailComponent } from './user/detail/detail.component';
import { CategoryComponent } from './user/category/category.component';
import { CartComponent } from './user/cart/cart.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { LayoutComponent } from './user/layout/layout/layout.component';
import { LoginComponent } from './user/login/login/login.component';
import { VoucherComponent } from './user/voucher/voucher.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '', component: HomeComponent
      },
      { path: 'category/:id', component: CategoryComponent },
      { path: 'home', component: HomeComponent },
      { path: 'detail/:id', component: DetailComponent},
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'voucher', component: VoucherComponent  },
    ],
  },
  {
    path:'login',
    component:LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
