import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

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

}
