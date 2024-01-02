import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { carts } from 'src/app/model/cart';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'
  ]
})
export class CheckoutComponent {
  sum = 0;
  totalPrice = 0;
  currentDate = new Date();
  transportPrice = 0;
  billnew: any;
  transportName = ""
  infoBill = {
    NguoiNhan: "",
    DienThoai: "",
    TongTien: 0,
    HinhThucThanhToan: "Giao hàng trực tiếp",
    MaPhieu: null,
    MaVanChuyen: null,
    TrangThai: 0,
    NgayTao: "",
    DiaChiNhan: "",
    MaKhachHang: null
  }
  isShow = true;
  vouchername = "";
  carts: carts[] = []
  transports: any;
  vouchers: any;
  constructor(
    private cart: CartserviceService,
    private http: HttpClient,
    private datePiPe: DatePipe,
    private toasmsg: ToastService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getcart()
    this.getvoucher()
    this.gettransport()
  }

  checkdate(ngaybd:any,ngaykt:any):boolean{
    let isChecked = false
    let ngaybatdau = new Date(ngaybd);
    let ngayketthuc = new Date(ngaykt)
    if(this.currentDate >= ngaybatdau && this.currentDate <= ngayketthuc){
      isChecked = true
    }
    return isChecked;
  }

  checkmoney(tientoithieu:any,tientoida:any):boolean{
    let ischeck = false

    if(this.sum >= tientoithieu && this.sum <= tientoida){
      ischeck = true
    }
    return ischeck
  }

  getcart() {
    this.carts = this.cart.getCartItems();
    this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
    this.totalPrice += this.sum
    console.log(this.carts);
  }

  getvoucher() {
    let data = localStorage.getItem("customer")
    let customer = data ? JSON.parse(data) : [];
    console.log(data);
    this.http.get("http://localhost:8000/user/voucher/getdatabycustomerid/" + customer.MaKhachHang).subscribe((response: any) => {
      if (response) {
        this.vouchers = response;
      }
    }, (error) => {
      console.error(error);
    })
  }

  gettransport() {

    this.http.get("http://localhost:8000/user/voucher/datatransport").subscribe((response: any) => {
      if (response) {
        this.transports = response;
      }
    }, (error) => {
      console.error(error);
    })
  }

  getnewdata() {
    this.http.get("http://localhost:8000/user/billofsale/datanew").subscribe((response: any) => {
      this.billnew = response
      console.log(this.billnew);

    }, (error) => {
      console.error(error);
    })
  }

  changetransport(item: any) {
    this.transportPrice = item.Gia
    this.transportName = item.TenVanChuyen
    this.infoBill.MaVanChuyen = item.MaVanChuyen
  }

  addvoucher(item: any) {
    this.vouchername = item.TenPhieu
    this.infoBill.MaPhieu = item.MaPhieu
    switch (item.LoaiPhieu) {
      case "Phần trăm":
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
        this.sum -= this.sum * (item.GiaTri / 100);

        break

      case "VND":
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
        this.sum -= item.GiaTri;
        break
      default:
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
    }

    this.isShow = true
  }

  removevoucher() {
    this.vouchername = ""
    this.infoBill.MaPhieu = null
    this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
  }

  payment() {
    const formattedDate = this.datePiPe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    if (formattedDate !== null) {
      this.infoBill.NgayTao = formattedDate;
    }
    let data = localStorage.getItem("customer")
    let customer = data ? JSON.parse(data) : [];

    this.infoBill.MaKhachHang = customer.MaKhachHang
    this.infoBill.TongTien = this.sum + this.transportPrice
    this.http.post("http://localhost:8000/user/billofsale/create", this.infoBill).subscribe((response: any) => {
      if (response.result) {
        
        this.http.get("http://localhost:8000/user/billofsale/datanew").subscribe((response: any) => {
          this.billnew = response

          this.carts.forEach((value) =>{       
            let params = {
              MaChiTietSanPham:value.ProductID,
              MaHoaDon:this.billnew[0].MaHoaDon,
              SoLuong:value.Quantity,
              GiaBan:value.ProductPrice,
              TongTien:(value.Quantity*value.ProductPrice)
            }     
            this.http.post("http://localhost:8000/user/detailbillofsale/create",params)
            .subscribe((response: any) => {
              if(response){
                console.log("thanh cong");
                this.cart.clearCart();
                this.getcart();
                this.toasmsg.showToast({
                  title: "Thành công",
                  message: "Thanh toán sản phẩm thành công",
                  type: "success"
                })
                // alert("Thanh toán thành công");
                this.router.navigate(['/cart'])
              }
              
              }, (error) => {
                console.error(error);
              })
          })
        }, (error) => {
          console.error(error);
        })
     
      }
      else {
        this.toasmsg.showToast({
          title: "Thanh toán thất bại",
          message: "Có lỗi xảy ra vui lòng thử lại",
          type: "error"
        })
      }

    }, (error) => {
      console.error(error);
    })

  }

  hiddenModal() {
    this.isShow = true
  }

  showModal() {
    this.isShow = false
  }
}
