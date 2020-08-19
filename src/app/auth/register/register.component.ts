import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;
  public registerForm = this.fb.group(
    {
      nombre: ['David', Validators.required],
      email: ['tes@gmail.com', [Validators.required, Validators.email]],
      password: ['123', Validators.required],
      password2: ['123', Validators.required],
      terminos: [true, Validators.required],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  campoNoValido(campo: string) {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    }
    return false;
  }

  crearUsuario() {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        if (err.status === 409) {
          Swal.fire({
            title: 'Error',
            text: 'Parece que este correo ya ha sido registrado',
            icon: 'error',
            confirmButtonText: 'ok',
          });
        }
      }
    );
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
