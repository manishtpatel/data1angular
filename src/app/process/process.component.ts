import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    ) { }

  @Input() productId

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      testcsv1: new FormControl(null, Validators.required),
      testcsv2: new FormControl(null, Validators.required),
      testcsv3: new FormControl(null, Validators.required),
    });
    // this.firstFormGroup.disable();
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  async onClick_step1_import(){
    let response = await this._http.post('http://localhost:3000/proxy/api/experimental/dags/import_data/dag_runs', { 
      'conf':{
        'productId': this.productId
      }, 
      'run_id': 'import_data' + Date.now()
     }).toPromise()

     await this._http.get('http://localhost:3000/proxy/api/experimental/dags/import_data/dag_runs/'+ response['execution_date'] ).toPromise()
  }
}
