import { Injectable } from '@angular/core';
import { MessagesIndex } from '../models/errors';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

private params = {
  'invalid-argument': 'Se proporcionó un argumento no válido para un método de autenticación.',
  'invalid-email-verified': 'El valor que se proporcionó para la propiedad del usuario emailVerified no es válido.',
  'invalid-email': 'El correo que se proporcionó no tiene un formato válido.',
  'invalid-password': 'Se proporcionó un argumento no válido para un método de autenticación.',
  'invalid-photo-url': 'El valor que se proporcionó para la propiedad del usuario photoURL no es válido.',
  'uid-already-exists': 'Otro usuario ya utiliza el uid proporcionado.',
  'email-already-exists': 'Otro usuario ya está utilizando el correo electrónico proporcionado.',
  'user-not-found': 'No existe ningún registro de usuario que corresponda a las credenciales. Verifique que este registrado.',
  'operation-not-allowed': 'El proveedor de acceso proporcionado está inhabilitado para tu proyecto de Firebase.',
  'invalid-credential': 'La credencial que se usa en la autenticación de los SDK de Admin no se puede emplear para realizar la acción deseada.',
  'phone-number-already-exists': 'Otro usuario ya utiliza el número de telefono proporcionado.',
  'wrong-password': 'La contraseña no es correcta.',
  'user-disabled': 'La cuenta ha sido deshabilitada por el administrador.',
  'email-already-in-use': 'El correo ya esta en uso en otra cuenta.'
} as MessagesIndex;

  constructor() { }

  printErrorByCode(code: string): string {
    code = code.split('/')[1];
    if (this.params[code]) {
        return (this.params[code]);
    } else {
        return (`Ocurrio un error desconocido! \n Codigo: ${code}`);
    }
}
}
