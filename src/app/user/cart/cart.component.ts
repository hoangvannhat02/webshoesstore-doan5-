import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { carts } from 'src/app/model/cart';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css',
]
})

@Injectable({
  providedIn: 'root'
})
export class CartComponent {
  datacarts:carts[] = [];
  getsum = 0;
  constructor(
    private cartservice:CartserviceService,
    private toastmsg:ToastService,
    private router:Router
    ){}
  ngOnInit(): void {
    this.getDataCart()
    console.log(this.getsum);
  }

  getDataCart(){
    this.datacarts = this.cartservice.getCartItems();
    this.getsum = this.datacarts.reduce((sum,value) => sum + (value.Quantity * value.ProductPrice) ,0)
    console.log(this.datacarts);
  }

  redirectToCheckout(event:Event){
    event.preventDefault();
    const data = localStorage.getItem("customer");
    
    
    if(data){
      this.router.navigate(["/checkout"]);
    }
    else{
      this.toastmsg.showToast({
        title:"Bạn cẩn phải đăng nhập",
        message:"Bạn cần phải đăng nhập trước khi thanh toán",
        type:"warning"
      })
    }

  }

  upquantity(cart:carts){
    cart.Quantity++;
    this.cartservice.updateCart(cart);
    this.getDataCart()
  }

  minusquantity(cart:carts){
    cart.Quantity--;
    if(cart.Quantity <= 1){
      cart.Quantity = 1
    }
    console.log(cart);
    
    this.cartservice.updateCart(cart);
    this.getDataCart()
  }

  deleteCart(id:number){
    if(confirm("Bạn có chắc muốn xóa không?")){
      this.cartservice.removeFromCart(id);
      this.toastmsg.showToast({
        title: 'Thành công',
        message: 'Xóa sản thành công',
        type: 'success',
        duration: 3000
      });
      this.getDataCart();
    }
  }
}
