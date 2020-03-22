import { Component, OnInit, Input, NgZone, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper'

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnChanges, AfterViewInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  interval

  @Input() product
  @ViewChild('stepper') myStepper: MatStepper;

  constructor(
    private zone: NgZone,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
  ) { }

  ngAfterViewInit(): void {
    this.onUpdatedProduct();

    this.interval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.product.firstChange) return;

    this.onUpdatedProduct();
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      testcsv1: new FormControl(null, Validators.required),
      testcsv2: new FormControl(null, Validators.required),
      testcsv3: new FormControl(null, Validators.required),
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
  }

  refreshData() {
    this._http.get(`http://localhost:3000/getproduct/${this.product._id}`).subscribe(value => {
      this.zone.run(() => {
        this.product = value[0]

        this.onUpdatedProduct()
      })
    })
  }

  onUpdatedProduct() {
    console.log('onUpdatedProduct', this.product)

    if (this.product.state > 1) {
      this.firstFormGroup.disable();
    } else {
      this.firstFormGroup.enable();
    }

    // set stepper step
    if (this.myStepper) {
      this.myStepper.reset();
      this.myStepper.selectedIndex = Math.floor(this.product.state) - 1
    }
  }

  async onClick_step1_import() {
    let response1 = await this._http.post(`http://localhost:3000/updatestatus/`, {
      productId: this.product._id,
      state: 1.1,
    }).toPromise()

    let response2 = await this._http.post('http://localhost:3000/proxy/api/experimental/dags/import_data/dag_runs', {
      'conf': {
        'productId': this.product._id
      },
      'run_id': 'import_data' + Date.now()
    }).toPromise()

    await this._http.get('http://localhost:3000/proxy/api/experimental/dags/import_data/dag_runs/' + response2['execution_date']).toPromise()
  }
}
