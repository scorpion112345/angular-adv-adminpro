import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  getMedicoPorId(id: string) {
    return this.http
      .get(`${base_url}/medicos/${id}`, this.herders)
      .pipe(map((resp: { ok: boolean; medico: Medico }) => resp.medico));
  }

  cargarMedicos() {
    return this.http
      .get(`${base_url}/medicos`, this.herders)
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    return this.http.post(`${base_url}/medicos`, medico, this.herders);
  }

  actualizarMedico(medico: Medico) {
    return this.http.put(
      `${base_url}/medicos/${medico._id}`,
      medico,
      this.herders
    );
  }

  eliminarMedico(id: string) {
    return this.http.delete(`${base_url}/medicos/${id}`, this.herders);
  }
}
