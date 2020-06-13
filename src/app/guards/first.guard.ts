import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class FirstGuard implements CanActivate {

  constructor(private router: Router,
    private storage: Storage) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.storage.get('first_time').then(res => {
      if (res === false) {
        console.log('app isnt for the first time started');
        this.router.navigate(["login"]);
        return false;
      }

      console.log('probably the first time');
      this.storage.set('first_time', false);
      return true;
    });
  }

}
