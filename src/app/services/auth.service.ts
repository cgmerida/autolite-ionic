import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from "../models/user";
import { auth, User as fireUser } from 'firebase/app';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUser: fireUser;

  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private alertCtl: AlertController,
  ) {
    this.fireAuth.authState.subscribe(fireUser => {
      this.authUser = fireUser;
    })
  }

  getAuthUserUid() {
    return this.authUser.uid;
  }

  getAuthUser() {
    return this.fireAuth.currentUser;
  }

  // Login in with email/password
  LogIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  // Register user with email/password
  RegisterUser(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  // Email verification when new user register
  SendVerificationMail() {
    return this.fireAuth.currentUser
      .then(user => {
        return user.sendEmailVerification();
      })
      .catch((err) => {
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

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  private AuthLogin(provider) {
    return this.fireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/app/inicio']);
        })
        this.storeUserProvider(result.user);
      }).catch((err) => {
        this.presentAlert('Error', 'Problema iniciando sesión', err);
      })
  }

  // Store user in this.storage
  private storeUserProvider(user) {
    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc<User>(`users/${user.uid}`);

    const userData = {
      uid: user.uid,
      // firstname: user.firstname,
      // lastname: user.lastname,
      email: user.email,
      // tel: user.tel,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign-out 
  SignOut() {
    return this.fireAuth.signOut().then(() => {
      this.router.navigate(['login']);
    })
  }

  private async presentAlert(hdr, shdr, msg) {
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
