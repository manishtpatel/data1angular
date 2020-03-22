import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private _http: HttpClient,
    public dialog: MatDialog
  ) { }

  title = 'gstweb';
  products;
  selectedProductId;
  selectedProduct;

  async ngOnInit() {
    this.products = await this._http.get('http://localhost:3000/getproducts').toPromise()
  }

  onClick_Add = async () => {
    const dialogRef = this.dialog.open(ProductNameDialog, {
      width: '250px',
      data: { name: '', }
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed', result);

      if (result) {
        await this._http.post('http://localhost:3000/addproduct', { name: result }).toPromise()
        this.products = await this._http.get('http://localhost:3000/getproducts').toPromise()

        this._snackBar.open(`${result} has been created.`, null, { duration: 2000 });
        this.selectedProductId = this.products[0]._id

        await this.onSelectionChanged_Product()
      }
    });
  }

  onSelectionChanged_Product = async () => {
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];

      if(element._id == this.selectedProductId){
        this.selectedProduct = element
        break;
      }
    }
  }
}

export interface DialogData {
  name: string;
}

@Component({
  selector: 'product-name-dialog',
  templateUrl: 'product-name-dialog.html',
})
export class ProductNameDialog {

  constructor(
    public dialogRef: MatDialogRef<ProductNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
