import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    // private router: Router,
    // private alertCtl: AlertController,
    private loadingController: LoadingController,
    // private errors: ErrorService,
  ) { }

  ngOnInit() {
  }

  async logIn(email, password) {

    let loading = await this.loadingController.create();
    await loading.present();

    await this.authService.LogIn(email, password);

    await loading.dismiss();
  }

  async authGoogle() {

    let loading = await this.loadingController.create();
    await loading.present();

    await this.authService.GoogleAuth();

    await loading.dismiss();

  }

  async authFb() {

    let loading = await this.loadingController.create();
    await loading.present();

    await this.authService.FacebookAuth();

    await loading.dismiss();

  }

  // async presentAlert(msg) {
  //   const alert = await this.alertCtl.create({
  //     // cssClass: 'my-custom-class',
  //     header: 'Error',
  //     subHeader: 'Problema iniciando sesión.',
  //     message: msg,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

}
