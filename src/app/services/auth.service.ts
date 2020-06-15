import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';


import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from "../models/user";
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: User;

  constructor(
    private storage: Storage,
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private alertCtl: AlertController,
    private userService: UserService,
  ) {
    // this.fireAuth.onAuthStateChanged
    this.fireAuth.authState.subscribe(authUser => {
      if (authUser) {
        this.userService.getUser(authUser.uid)
          .subscribe((userBd: User) => {
            this.userData = userBd;
            this.storage.set('user', this.userData);
            this.router.navigate(['/app/inicio']);
          });
      } else {
        this.storage.remove('user');
      }
    })
  }

  getAuthUserUid(){
    return this.fireAuth.currentUser
    .then(user => {
      return user.uid;
    })
  }

  getAuthUser(){
    return this.fireAuth.currentUser
    .then(user => {
      return user;
    })
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
  get isLoggedIn(): Promise<boolean> {
    return this.storage.get('user').then((user) => {
      return (user !== null && user.emailVerified !== false) ? true : false;
    });
  }

  // Returns true when user's email is verified
  get isEmailVerified(): Promise<boolean> {
    return this.storage.get('user').then((user) => {
      return (user.emailVerified !== false) ? true : false;
    });
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

  // Store user in this.storage
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
