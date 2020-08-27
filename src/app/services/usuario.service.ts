import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const gapi: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get herders() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);

    localStorage.setItem('menu', JSON.stringify(menu));
  }
  async googleInit() {
    return new Promise((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '383544493321-e0bf6nv70aqmdrgq669qkoid5h7epjur.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, img, nombre, role, uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          this.guardarLocalStorage(resp.token, resp.menu);

          return true;
        }),
        catchError((err) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };
    return this.http.put(
      `${base_url}/usuarios/${this.usuario.uid}`,
      data,
      this.herders
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    // borar menu
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  cargarUsuarios(page: number = 1) {
    return this.http
      .get<CargarUsuario>(`${base_url}/usuarios?page=${page}`, this.herders)
      .pipe(
        map((res) => {
          const usuarios = res.usuarios.map((user) => {
            const { email, google, img, nombre, role, uid } = user;
            return new Usuario(nombre, email, '', img, google, role, uid);
          });
          res.usuarios = usuarios;
          return res;
        })
      );
  }

  elimiarUsuario(uid: string) {
    return this.http.delete(`${base_url}/usuarios/${uid}`, this.herders);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.herders
    );
  }
}
