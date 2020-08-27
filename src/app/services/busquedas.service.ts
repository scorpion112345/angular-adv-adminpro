import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get herders() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map((user) => {
      const { email, google, img, nombre, role, uid } = user;
      return new Usuario(nombre, email, '', img, google, role, uid);
    });
  }

  busquedaGlobal(termino: string) {
    return this.http.get<any[]>(`${base_url}/todo/${termino}`, this.herders);
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this.http
      .get<any[]>(`${base_url}/todo/coleccion/${tipo}/${termino}`, this.herders)
      .pipe(
        map((res: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(res.resultados);
            case 'hospitales':
              return res.resultados as Hospital[];
            case 'medicos':
              return res.resultados as Medico[];
            default:
              return [];
          }
        })
      );
  }
}
