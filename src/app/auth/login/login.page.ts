import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtl: AlertController
    ) { }

  ngOnInit() {
  }


  logIn(email, password) {
    this.authService.SignIn(email, password)
      .then((res) => {
        if(this.authService.isEmailVerified) {
          this.router.navigate(['/app/inicio']);
        } else {
          this.presentAlert('Correo no verificado.');
          return false;
        }
      }).catch((error) => {
        this.presentAlert(error.message)
      })
  }



  async presentAlert(msg) {
    const alert = await this.alertCtl.create({
      // cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: 'Problema iniciando sesión.',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
