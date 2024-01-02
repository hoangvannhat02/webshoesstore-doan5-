import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'
]
})
export class CategoryComponent {
  id:any;
  products:any;
  categoryproducts:any;
  constructor(private http:HttpClient,private route: ActivatedRoute){};

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id')
    this.getdatabyid(this.id);
    this.getdatacategory();
  }

  getdatabyid(id:any){
    this.http.get("http://localhost:8000/user/product/databycateid/" + id).subscribe((response: any) => {
        if (response) {
          this.products = response;
          console.log(this.products);
        }
      }, (error) => {
        console.error(error);
      })
  }
  getdatacategory() {
    this.http.get("http://localhost:8000/user/categoryproduct/data").subscribe((response: any) => {
      if (response) {
        this.categoryproducts = response;
        console.log(this.categoryproducts);
      }
    }, (error) => {
      console.error(error);
    })
  }
  solvediscount(originalPrice: number, discountedPrice: number): number {
    return Math.ceil((originalPrice - discountedPrice) / originalPrice * 100);
  }
}
