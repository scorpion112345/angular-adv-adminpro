import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu'));
  }
  /* menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      children: [
        { title: 'Main', url: '/' },
        { title: 'ProgressBar', url: 'progress' },
        { title: 'Graficas', url: 'grafica1' },
        { title: 'Promesas', url: 'promesas' },
        { title: 'Rxjs', url: 'rxjs' },
      ],
    },
    {
      title: 'Mantenimiento',
      icon: 'mdi mdi-folder-lock-open',
      children: [
        { title: 'usuarios', url: 'usuarios' },
        { title: 'hospitales', url: 'hospitales' },
        { title: 'medicos', url: 'medicos' },
      ],
    },
  ]; */
}
