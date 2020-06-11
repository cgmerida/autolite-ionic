import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {


  signinForm: FormGroup;
  isSubmitted = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController
  ) {

    this.signinForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      tel: [null, Validators.pattern('[0-9]{8}')],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });

  }

  ngOnInit() {
  }

  get errorControl() {
    return this.signinForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (!this.signinForm.valid) {
      console.log('No ingreso los datos necesarios!');
      return false;
    }


    this.signUp(this.signinForm.get('email').value, this.signinForm.get('password').value);

  }


  signUp(email, password) {
    this.authService.RegisterUser(email, password)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail()
        this.router.navigate(['verify-email']);
      }).catch((error) => {
        console.error(error.message);
        this.presentAlert(error.message);
      })
  }


  async presentAlert(msg) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: 'Problema registrando usuario.',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


}
