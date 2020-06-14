import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  carsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) {
    this.carsForm = this.formBuilder.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      engine: [null, Validators.required],
      transmition: [null, Validators.pattern('[0-9]{8}')],
      color: [null, Validators.required],
      license: [null, Validators.required]
    });
  }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss();

    // this.modalController.dismiss(DATA);
  }

}
