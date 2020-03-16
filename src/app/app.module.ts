import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, ProductNameDialog } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ProcessComponent } from './process/process.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductNameDialog,
    ProcessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatSnackBarModule,
    MatStepperModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
  ],
  entryComponents: [
    ProductNameDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
