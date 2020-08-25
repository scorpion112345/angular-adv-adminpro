import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
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

  cargarHospitales() {
    return this.http
      .get(`${base_url}/hospitales`, this.herders)
      .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      );
  }

  crearHospital(nombre: string) {
    return this.http.post(`${base_url}/hospitales`, { nombre }, this.herders);
    /*       .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      ); */
  }

  actualizarHospital(id: string, nombre: string) {
    return this.http.put(
      `${base_url}/hospitales/${id}`,
      { nombre },
      this.herders
    );
    /*       .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      ); */
  }

  eliminarHospital(id: string) {
    return this.http.delete(`${base_url}/hospitales/${id}`, this.herders);
  }
}
