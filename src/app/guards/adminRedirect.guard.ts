import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, flatMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AdminRedirectGuard implements CanActivate {
    private isAdmin = false;

    constructor(
        private router: Router,
        private userService: UserService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.getAuthUser().pipe(
            map(user => {
                if (user.isAdmin) {
                    this.router.navigate(["admin"]);
                    return false;
                }
                return true;
            })
        )
    }
}