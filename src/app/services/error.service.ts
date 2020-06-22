import { Injectable } from '@angular/core';
import { MessagesIndex } from '../models/errors';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private params = {
    'auth/invalid-argument': 'Se proporcionó un argumento no válido para un método de autenticación.',
    'auth/invalid-email-verified': 'El valor que se proporcionó para la propiedad del usuario emailVerified no es válido.',
    'auth/invalid-email': 'El correo que se proporcionó no tiene un formato válido.',
    'auth/invalid-password': 'Se proporcionó un argumento no válido para un método de autenticación.',
    'auth/invalid-photo-url': 'El valor que se proporcionó para la propiedad del usuario photoURL no es válido.',
    'auth/uid-already-exists': 'Otro usuario ya utiliza el uid proporcionado.',
    'auth/email-already-exists': 'Otro usuario ya está utilizando el correo electrónico proporcionado.',
    'auth/user-not-found': 'No existe ningún registro de usuario que corresponda a las credenciales. Verifique que este registrado.',
    'auth/operation-not-allowed': 'El proveedor de acceso proporcionado está inhabilitado para tu proyecto de Firebase.',
    'auth/auth/invalid-credential': 'La credencial que se usa en la autenticación de los SDK de Admin no se puede emplear para realizar la acción deseada.',
    'auth/phone-number-already-exists': 'Otro usuario ya utiliza el número de telefono proporcionado.',
    'auth/wrong-password': 'La contraseña no es correcta.',
    'auth/user-disabled': 'La cuenta ha sido deshabilitada por el administrador.',
    'auth/email-already-in-use': 'El correo ya esta en uso en otra cuenta.',
    'storage/invalid-argument': 'Archivo no válido.'
  } as MessagesIndex;

  constructor() { }

  printErrorByCode(code: string): string {
    // code = code.split('/')[1];
    if (this.params[code]) {
      return (this.params[code]);
    } else {
      return (`Ocurrio un error desconocido! \n Codigo: ${code}`);
    }
  }
}
