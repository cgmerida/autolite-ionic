import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  isSubmitted = false;
  confirm = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private userService: UserService,
    private errors: ErrorService,
    private loadingController: LoadingController,
  ) {

    this.registerForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      tel: [null, Validators.pattern('[0-9]{8}')],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    this.confirm = this.registerForm.get('password').value === this.registerForm.get('confirmpassword').value;

    if (!this.registerForm.valid || !this.confirm) {
      this.registerForm.get('password').patchValue(null);
      this.registerForm.get('confirmpassword').patchValue(null);
      return false;
    }

    this.register(this.registerForm.get('email').value, this.registerForm.get('password').value);
  }

  register(email, password) {
    this.loadingController.create()
      .then(loading => {
        loading.present();
        this.authService.RegisterUser(email, password)
          .then((res) => {
            let user: User = {
              uid: res.user.uid,
              ...this.registerForm.value,
              displayName: res.user.displayName,
              photoURL: res.user.photoURL,
              emailVerified: res.user.emailVerified,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return this.userService.addUser(user);
          })
          .then(() => {
            return this.authService.SendVerificationMail();
          })
          .then(() => {
            this.router.navigate(['verify-email']);
          })
          .catch((error) => {
            console.log(error);
            this.presentAlert(this.errors.printErrorByCode(error.code));
          })
          .finally(() => {
            loading.dismiss();
          });
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
