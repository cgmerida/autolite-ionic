import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ViewChild } from "@angular/core";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  constructor() { }

  ngOnInit() {
  }

  onSlideChanged() {

    this.slides.getActiveIndex()
      .then(n => {
        if (n % 2 == 1) {
          this.bgLight();
        } else {
          this.bgBlack();
        }
      })
      .catch(err => console.log(err));
  }

  bgBlack() {
    document.querySelector('ion-content').classList.remove('light');
    document.querySelector('ion-button.left').classList.add('ion-color-light');
  }

  bgLight() {
    document.querySelector('ion-content').classList.add('light');
    document.querySelector('ion-button.left').classList.remove('ion-color-light');
  }

}
