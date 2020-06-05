import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  private enviado: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  enviarCorreo() {
    this.enviado = true;
  }
}
