import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private uid: string;

  constructor(private storage: AngularFireStorage,
    private authService: AuthService) {
    authService.getAuthUserUid().then(uid => {
      this.uid = uid;
    })
  }

  uploadCar(img, name): AngularFireUploadTask {
    let fecha = new Date().toLocaleDateString().replace(/\//g, "-");
    return this.storage.upload(`cars/${this.uid}/${name}_${fecha}.jpg`, img);
  }
}
