import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage {

  enviado: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  enviarCorreo() {
    this.authService.PasswordRecover();
    this.enviado = true;
  }
}
