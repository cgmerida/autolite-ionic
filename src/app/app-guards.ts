
import { redirectLoggedInTo } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { User } from 'firebase';

export const redirectLoggedInToInicio = () => redirectLoggedInTo(['app/inicio']);

export const redirectOrVerifyEmail = () =>
    map((user: User) => {
        return user ? (user.emailVerified ? true : ['/verify-email']) : ['/login'];
    });

