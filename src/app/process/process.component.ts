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
  step1FormControl: FormControl;
  step2FormControl: FormControl;
  step3FormControl: FormControl;
  step4FormControl: FormControl;
  secondFormGroup: FormGroup;
  interval: any;

  @Input() product
  @ViewChild('stepper') myStepper: MatStepper;

  constructor(
    private zone: NgZone,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
  ) { }

  ngAfterViewInit(): void {
    this.onUpdatedProduct(true);

    this.interval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.product.firstChange) return;

    this.onUpdatedProduct(true);
  }

  ngOnInit(): void {
    this.step1FormControl = new FormControl(this.product.state, Validators.min(2))
    this.step2FormControl = new FormControl(this.product.state, Validators.min(3))
    this.step3FormControl = new FormControl(this.product.state, Validators.min(4))
    this.step4FormControl = new FormControl(this.product.state, Validators.min(5))

    this.firstFormGroup = this._formBuilder.group({
      testcsv1: new FormControl(null, Validators.required),
      testcsv2: new FormControl(null, Validators.required),
    });

    this.secondFormGroup = this._formBuilder.group({
      selectedSaleConditions: new FormControl(null)
    });

    // this.interval = setInterval(() => {
    //   this.refreshData();
    // }, 5000);

  }

  refreshData() {
    this._http.get(`http://localhost:3000/getproduct/${this.product._id}`).subscribe(value => {
      this.zone.run(() => {
        const isStateChanged = (value[0].state != this.product.state)
        this.product = value[0]

        this.onUpdatedProduct(isStateChanged)
      })
    })
  }

  onUpdatedProduct(isStateChanged: boolean) {
    console.log('onUpdatedProduct', this.product)

    this.step1FormControl.setValue(this.product.state)
    this.step2FormControl.setValue(this.product.state)
    this.step3FormControl.setValue(this.product.state)
    this.step4FormControl.setValue(this.product.state)

    if (isStateChanged) {
      this.myStepper.reset();

      // some woodo magic with step selection, to allow linear mode skip selection, mark all as completed
      for (let index = 0; index < Math.floor(this.product.state) - 1; index++) {
        this.myStepper.steps.forEach((item, iindex, steps) => {
          if (iindex == index) {
            item.completed = true;
            item.interacted = false;
          }
        })
      }
      for (let index = Math.floor(this.product.state) - 1; index <  5; index++) {
        this.myStepper.steps.forEach((item, iindex, steps) => {
          if (iindex == index) {
            item.completed = false;
            item.interacted = false;
          }
        })
      }

      this.myStepper.selectedIndex = Math.floor(this.product.state) - 1
    }
  }

  async onClick_step1_import() {
    // intermittent for ui to reflect progress bar
    this.product.state = 1.1
    this.onUpdatedProduct(true)

    await this._http.post(`http://localhost:3000/updatestatus/`, {
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

  onClick_step2_done(state: number) {
    // intermittent for ui to reflect progress bar
    this.product.state = state

    this._http.post(`http://localhost:3000/updatestatus/`, {
      productId: this.product._id,
      state: Math.ceil(state),
    }).subscribe()
  }
}
