import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

    private isAdmin = false;

    constructor(
        private router: Router,
        private userService: UserService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.userService.getAuthUser().pipe(
            map(user => {
                if (!user.isAdmin) {
                    this.router.navigate(["app"]);
                    return false;
                }
                return true;
            })
        )
    }
}