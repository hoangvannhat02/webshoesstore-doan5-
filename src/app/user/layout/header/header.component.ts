import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartserviceService } from 'src/app/my-service/cartservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'
]
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent{
  cartCount: number = 0;
  customer:any;
  isExit = false;
  sum:number = 0;
  carts:any [] = [];
  constructor(private router:Router, private cart: CartserviceService){}
  ngOnInit(): void {
    this.loadcart()
    const data = localStorage.getItem("customer");
    this.customer = data ? JSON.parse(data) : [];
    if(data){
      this.isExit = true
    }
  }

  loadcart(){
    this.cart.cartData$.subscribe((data) => {
      this.cartCount = data;
    });
    // this.carts = this.cart.getCartItems();
    // if(this.carts){
    //   this.sum = this.carts.reduce((sum,value) => sum + value.Quantity,0);
    //   console.log(this.sum);
    // }
  }
  
  logout(event:Event){
    event.preventDefault()
    localStorage.removeItem("customer");
    this.router.navigate(['/login'])
  }

}
