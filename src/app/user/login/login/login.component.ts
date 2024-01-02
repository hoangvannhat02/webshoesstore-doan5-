import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { InputvalidationService } from 'src/app/my-service/inputvalidation.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
    '../../../../assets/my-ui/css/login.css'
  ]
})
export class LoginComponent {
  user = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  user_registration = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  message_resgistration = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  message = {
    email: "",
    password: "",
  }

  customer: any;
  isEmailInvalid = false
  isPasswordInvalid = false
  isEmailResgisInvalid = false
  isPasswordResgisInvalid = false
  isNameInvalid = false
  isPhoneInvalid = false
  isAddressInvalid = false
  constructor(private el: ElementRef, private router: Router, private renderer: Renderer2, private valid: InputvalidationService, private http: HttpClient,private toatmsg:ToastService) { }
  ngAfterViewInit() {
    const signUpButton = this.el.nativeElement.querySelector('#signUp');
    const signInButton = this.el.nativeElement.querySelector('#signIn');
    const container = this.el.nativeElement.querySelector('#container');

    signUpButton.addEventListener('click', () => {
      this.renderer.addClass(container, 'right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      this.renderer.removeClass(container, 'right-panel-active');
    });
  }

  onInputEmail() {
    this.isEmailInvalid = false
  }
  onInputPassWord() {
    this.isPasswordInvalid = false
  }
  onInputRegisEmail() {
    this.isEmailResgisInvalid = false
  }
  onInputRegisPassWord() {
    this.isPasswordResgisInvalid = false
  }
  onInputName() {
    this.isNameInvalid = false
  }
  onInputPhonenumber() {
    this.isPhoneInvalid = false
  }
  onInputAddressnumber() {
    this.isAddressInvalid = false
  }

  onSubmit() {
    console.log(this.user.email.length);
    if (!this.user.email.length) {
      this.isEmailInvalid = true;
      this.message.email = "Thông tin tài khoản không được để trống"
    } else if (!this.valid.isValidEmail(this.user.email)) {
      this.isEmailInvalid = true;
      this.message.email = "Không đúng định dạng email"
    } else {
      this.isEmailInvalid = false;
    }


    if (this.user.password.length <= 0) {
      this.isPasswordInvalid = true;
      this.message.password = "Thông tin mật khẩu không được để trống"
    } else if (this.valid.isValidLength(this.user.password, 8)) {
      this.isPasswordInvalid = true;
      this.message.password = "Chỉ có thể nhập tối đa 8 ký tự"
    }
    else {
      this.isPasswordInvalid = false;
    }

    if (!this.isEmailInvalid && !this.isPasswordInvalid) {
      let params = {
        Email:this.user.email,
        PassWord:this.user.password
      }
      this.http.post("http://localhost:8000/user/customer/login",params).subscribe((response: any) => {        
        if (response.result.length > 0) {          
          const data = localStorage.getItem("customer")
          const datauser = data ? JSON.parse(data) : []
          if(datauser.length === 0){
            const user = {
              MaKhachHang:response.result[0].MaKhachHang,
              HoVaTen: response.result[0].HoVaTen,
              DiaChi:response.result[0].DiaChi,
              SoDienThoai:response.result[0].SoDienThoai,
              Email:response.result[0].Email,
              Anh:response.result[0].Anh,
              PassWord:response.result[0].PassWord
            }
            localStorage.setItem("customer",JSON.stringify(user))
            setTimeout(() => {
              this.toatmsg.showToast({
                title:"Đăng nhập thành công",
                message:"Xin chào, "+user.HoVaTen,
                type:"success"
              })
              this.router.navigate(["/"])
            },3000)
            
          }
          else{
            setTimeout(()=>{
              this.toatmsg.showToast({
                title:"Đăng nhập thành công",
                message:"Chào mừng bạn đến với cửa hàng",
                type:"success"
              })
              this.router.navigate(["/"])
            },3000)
           
          }
          
        }
        else{
          this.isPasswordInvalid = true
          this.message.password = "Tài khoản hoặc mật khẩu không chính xác"
        }
        
        
      }, (error) => {
        console.error(error);
      })
    }
  }

  onSubmitRegistration() {
    if (!this.user_registration.email.length) {
      this.isEmailResgisInvalid = true;
      this.message_resgistration.email = "Thông tin tài khoản không được để trống"
    } else if (!this.valid.isValidEmail(this.user_registration.email)) {
      this.isEmailResgisInvalid = true;
      this.message_resgistration.email = "Không đúng định dạng email"
    } else {
      this.isEmailResgisInvalid = false;
    }


    if (!this.user_registration.password.length) {
      this.isPasswordResgisInvalid = true;
      this.message_resgistration.password = "Thông tin mật khẩu không được để trống"
    } else if (this.valid.isValidLength(this.user.password, 8)) {
      this.isPasswordResgisInvalid = true;
      this.message_resgistration.password = "Chỉ có thể nhập tối đa 8 ký tự"
    }
    else {
      this.isPasswordResgisInvalid = false;
    }

    if (!this.user.name.length) {
      this.isNameInvalid = true;
      this.message_resgistration.name = "Thông tin họ tên không được để trống"
    } else if (this.valid.isValidLength(this.user.name, 100)) {
      this.isNameInvalid = true;
      this.message_resgistration.name = "Chỉ có thể nhập tối đa 100 ký tự"
    }
    else {
      this.isNameInvalid = false;
    }

    if (!this.user.address.length) {
      this.isAddressInvalid = true;
      this.message_resgistration.address = "Thông tin địa chỉ không được để trống"
    } else if (this.valid.isValidLength(this.user.address, 200)) {
      this.isAddressInvalid = true;
      this.message_resgistration.address = "Chỉ có thể nhập tối đa 100 ký tự"
    }
    else {
      this.isAddressInvalid = false;
    }

    if (!this.user.phone.length) {
      this.isPhoneInvalid = true;
      this.message_resgistration.phone = "Thông tin số điện thoại không được để trống"
    } else if (this.valid.isValidPhoneNumber(this.user.phone)) {
      this.isPhoneInvalid = true;
      this.message_resgistration.phone = "Chỉ có thể nhập tối đa 10 số"
    }
    else {
      this.isPhoneInvalid = false;
    }

    if (!this.isEmailResgisInvalid && !this.isPasswordResgisInvalid && !this.isAddressInvalid && !this.isNameInvalid && !this.isPhoneInvalid) {
      let params = {
        Email: this.user_registration.email,
        PassWord: this.user_registration.password,
        SoDienThoai: this.user.phone,
        DiaChi: this.user.address,
        Anh: "",
        HoVaTen: this.user.name
      }
      console.log(params);
      
      this.http.post("http://localhost:8000/user/customer/create", params).subscribe((response: any) => {
        if (response) {
          this.customer = response
          console.log(response);
          alert("Thêm thành công")
          window.location.reload()
        }
        else{
          console.log(response);
          alert("Thêm thất bại")
        }

      }, (error) => {
        console.error(error);
      })

    }
  }

}
