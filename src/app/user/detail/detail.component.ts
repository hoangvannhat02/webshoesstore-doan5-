import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css',
]
})
export class DetailComponent {
  SoLuongTon = 0;
  detailproduct:any;
  datacolorbyproid:any;
  databyproductid:any;
  datasizebyproid:any;
  selectedSize = 0;

  listDetailProductImg = {
    path1:"",
    path2:"",
    path3:""
  }
  id:any;
  constructor(private http:HttpClient, private route: ActivatedRoute){};

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id')
    this.getdatabyid(this.id);
  }

  getdatabyid(id:any){
    
    this.http.get("http://localhost:8000/user/product/dataproductbyid/" + id).subscribe((response: any) => {
        if (response) {
          this.detailproduct = response;
          this.SoLuongTon = this.detailproduct[0]?.SoLuongTon;
          this.selectedSize = this.detailproduct[0]?.MaKichThuoc;
          console.log(this.detailproduct);
          this.listDetailProductImg.path1 = this.detailproduct[0]?.DuongDan;
          this.listDetailProductImg.path2 = this.detailproduct[1]?.DuongDan;
          this.listDetailProductImg.path3 = this.detailproduct[2]?.DuongDan;

          let params = {
            proid: id,
            colorid: this.detailproduct[0].MaMau
          }
          console.log(params);
          
      
          this.http.post("http://localhost:8000/user/product/datasize", params).subscribe((response: any) => {
            if (response) {
              this.datasizebyproid = response
             console.log(this.datasizebyproid);
            }
          }, (error) => {
            console.error(error);
          })
      
          this.http.get("http://localhost:8000/user/product/datacolor/" + this.id).subscribe((response: any) => {
              if (response) {
                this.datacolorbyproid = response;
              }
            }, (error) => {
              console.error(error);
            })
      
            this.http.get("http://localhost:8000/user/product/dataproductbyid/" + this.id).subscribe((response: any) => {
              if (response) {
                this.databyproductid = response;
              }
            }, (error) => {
              console.error(error);
            })
        }
      }, (error) => {
        console.error(error);
    })
  }

  onChangeSize(event: any) {
    let sizeid = this.selectedSize;
    console.log(this.databyproductid);
    console.log(sizeid);
    
    const data = this.databyproductid.find((item: any) => item.MaKichThuoc === Number(sizeid));
    console.log(data);
    
    let params = {
      proid: data.MaSanPham,
      colorid: data.MaMau,
      sizeid:sizeid
    }
    console.log(params);
    
    this.http.post("http://localhost:8000/user/product/dataquantyofsize", params).subscribe((response: any) => {
      if (response) {
        // this.datasizebyproid = response
        console.log(response);
        
        this.SoLuongTon = response[0].SoLuongTon;
      }
    }, (error) => {
      console.error(error);
    })
  }

  onChangeColor(event: any) {
    let colorid = event.target.value;

    const data = this.datacolorbyproid.find((item: any) => item.MaMau === Number(colorid));
    let params = {
      detailproid: data.MaChiTietSanPham,
      colorid: colorid
    }
    this.http.post("http://localhost:8000/user/product/getimgbycolorid", params).subscribe((response: any) => {
      if (response) {
        this.SoLuongTon = response[0].SoLuongTon;
        this.listDetailProductImg.path1 = response[0]?.DuongDan;
        this.listDetailProductImg.path2 = response[1]?.DuongDan;
        this.listDetailProductImg.path3 = response[2]?.DuongDan;
    
        let data = {
          proid:response[0].MaSanPham,
          colorid:response[0].MaMau
        }
        this.http.post("http://localhost:8000/user/product/datasize", data).subscribe((response: any) => {
          if (response) {
            this.datasizebyproid = response
            this.selectedSize = response[0].MaKichThuoc
            console.log(response);
          }
        }, (error) => {
          console.error(error);
        })
      }
    }, (error) => {
      console.error(error);
    })
  }
}
