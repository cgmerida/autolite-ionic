import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";


import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User, AuthUser } from "../models/users";
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: AuthUser;

  constructor(
    public fireStore: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private alertCtl: AlertController
  ) {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Login in with email/password
  SignIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  // Register user with email/password
  RegisterUser(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  // Email verification when new user register
  SendVerificationMail() {
    // this.fireAuth.currentUser.sendEmailVerification() 
    return this.fireAuth.currentUser.then(user => {
      user.sendEmailVerification();
    }).then(() => {
      this.router.navigate(['verify-email']);
    }).catch((err) => {
      console.error(err);
      this.presentAlert('Error', 'Problema enviando correo', err);
    });

  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.fireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.presentAlert('¡Bien!', null, 'El correo para reiniciar tu contraseña ya fue enviado, revisa tu correo');
      }).catch((err) => {
        this.presentAlert('Error', 'Problema enviando correo', err);
      })
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return this.fireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/app/inicio']);
        })
        this.SetUserData(result.user);
      }).catch((err) => {
        this.presentAlert('Error', 'Problema iniciando sesión', err);
      })
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      // firstname: user.firstname,
      // lastname: user.lastname,
      email: user.email,
      // tel: user.tel,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      // createdAt: new Date(),
      // updatedAt: new Date(),
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign-out 
  SignOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }



  async presentAlert(hdr, shdr, msg) {
    const alert = await this.alertCtl.create({
      // cssClass: 'my-custom-class',
      header: hdr,
      subHeader: shdr,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


}
