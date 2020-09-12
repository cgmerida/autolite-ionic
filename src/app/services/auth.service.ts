import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from "../models/user";
import { auth, User as fireUser } from 'firebase/app';
import { AlertController, Platform } from '@ionic/angular';
import { ErrorService } from './error.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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
    private errors: ErrorService,
    private googlePlus: GooglePlus,
    private platform: Platform,

  ) {
    this.fireAuth.authState.subscribe(fireUser => {
      if (fireUser)
        this.authUser = fireUser;
    })
  }

  getAuthUserUid(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.authUser) {
        resolve(this.authUser.uid)
      } else {
        return this.fireAuth.currentUser
          .then(fireUser => {
            if (fireUser)
              resolve(fireUser.uid);
          })
      }
      reject(`No esta disponible el usuario`);
    })

  }

  getAuthUser() {
    return this.fireAuth.currentUser;
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
    if (this.platform.is('android')) {
      this.googleAuthAndroid()
    } else {
      return this.AuthLogin(new auth.GoogleAuthProvider());
    }
  }

  async googleAuthAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': '320328269998-urcbhefqbpsb05q1t644d3m7a6iptlho.apps.googleusercontent.com',
      'offline': true
    });

    try {
      const resConfirmed = await this.fireAuth.signInWithCredential(auth.GoogleAuthProvider.credential(res.idToken));
      this.router.navigate(['/app/inicio']);
      this.storeUserProvider(resConfirmed.user);
    } catch (err) {
      this.presentAlert('Error', 'Problema iniciando sesión', this.errors.printErrorByCode(err.code));
    }

  }


  // Sign in with Facebook
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  // Login in with email/password
  LogIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/app/inicio']);
        })
        // this.storeUser(result.user);
      }).catch((err) => {
        this.presentAlert('Error', 'Problema iniciando sesión',
          this.errors.printErrorByCode(err.code));
      })
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
        this.presentAlert('Error', 'Problema iniciando sesión', this.errors.printErrorByCode(err.code));
      })
  }

  private storeUserProvider(user) {

    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc<User>(`users/${user.uid}`);

    const userData = {
      uid: user.uid,
      email: user.email,
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

  private storeUser(user) {

    console.log(user);

    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc<User>(`users/${user.uid}`);

    const userData = {
      uid: user.uid,
      emailVerified: user.emailVerified,
      updatedAt: new Date(),
    }
    userRef.update(userData);

    userRef.valueChanges().subscribe(user => {
      console.log(user);
    });
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
